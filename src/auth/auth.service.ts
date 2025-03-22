import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from './modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { EmailVerificationService } from './modules/email-verification/email-verification.service';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PasswordResetTokensService } from './modules/password-reset-tokens/password-reset-tokens.service';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationsService: EmailVerificationService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findOneBy({ email });

    if (existingUser) {
      if (!existingUser.password) {
        await this.emailVerificationsService.sendIsAlreadyRegisterWithProvider(email);
      }

      if (!existingUser.isEmailVerified) {
        await this.emailVerificationsService.sendVerificationEmail(email, existingUser);
      } else {
        await this.emailVerificationsService.sendIsAlreadyVerifiedEmail(email);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.save({
        email,
        password: hashedPassword,
        roles: [{ id: 2 }],
        authProviders: [{ provider: 'local', providerId: email }],
      });

      await this.emailVerificationsService.sendVerificationEmail(email, user);
    }

    return {
      message: 'Revise su correo y siga las instrucciones',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOne({
      where: { email },
      relations: { roles: true },
    });
    if (!user || !user.isEmailVerified) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return this.generateAccessToken(user);
  }

  async google(code: string) {
    const { sub, email, picture, name } = await this.verifyGoogleCode(code);

    if (!email) throw new UnauthorizedException();

    let user = await this.usersService.findOne({
      where: { email },
      relations: { authProviders: true, roles: true },
    });

    if (user) {
      const haveGoogleProvider = user.authProviders.some((authProvider) => authProvider.provider === 'google' && authProvider.providerId === sub);
      if (!haveGoogleProvider) {
        await this.usersService.addProvider('google', sub, user);
      }
    } else {
      user = await this.usersService.save({
        email,
        profile: { name, picture },
        authProviders: [{ provider: 'google', providerId: sub }],
        roles: [{ id: 2 }],
      });
    }

    return this.generateAccessToken(user);
  }

  async verifyGoogleCode(code: string) {
    const { tokens } = await this.googleClient.getToken(code);

    const ticket = await this.googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('No se pudo obtener la información del usuario.');
    }

    return payload;
  }

  async verifyEmail(token: string) {
    const verificationToken = await this.emailVerificationsService.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!verificationToken || verificationToken.user.isEmailVerified) {
      throw new BadRequestException();
    }

    if (new Date(verificationToken.expiresAt) < new Date()) {
      throw new BadRequestException();
    }

    const user = verificationToken.user;
    user.isEmailVerified = true;
    await this.usersService.save(user);

    await this.emailVerificationsService.delete({ user });

    return { message: 'Correo verificado exitosamente' };
  }

  async sendVerification(email: string) {
    const user = await this.usersService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException();
    }

    if (!user.isEmailVerified) {
      await this.emailVerificationsService.sendVerificationEmail(email, user);
    } else {
      await this.emailVerificationsService.sendIsAlreadyVerifiedEmail(email);
    }

    return { message: 'Código de verificación enviado' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (user) {
      await this.passwordResetTokensService.sendPasswordResetToken(email, user);
    }

    return {
      message: 'Si el email existe, se ha enviado un enlace de recuperación',
    };
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await this.passwordResetTokensService.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!resetToken || new Date(resetToken.expiresAt) < new Date()) {
      throw new BadRequestException();
    }

    const user = resetToken.user;
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      if (!user.password) {
        await this.usersService.addProvider('local', user.email, user);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.usersService.save(user);

    await this.passwordResetTokensService.delete({ user });

    return { message: 'Contraseña actualizada correctamente' };
  }

  generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
