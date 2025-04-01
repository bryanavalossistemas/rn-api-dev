import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '@/auth/modules/users/users.service';
import { EmailVerificationService } from '@/auth/modules/email-verification/email-verification.service';
import { PasswordResetTokensService } from '@/auth/modules/password-reset-tokens/password-reset-tokens.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { User } from '@/auth/modules/users/entities/user.entity';
import { AuthProvidersService } from '@/auth/modules/auth-providers/auth-providers.service';
import { ProfilesService } from '@/auth/modules/profiles/profiles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationsService: EmailVerificationService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly authProvidersService: AuthProvidersService,
    private readonly profilesService: ProfilesService,
    private readonly configService: ConfigService,

    @Inject('GOOGLE_OAUTH_CLIENT')
    private readonly googleClient: OAuth2Client,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findOneBy({ email: email });

    if (existingUser) {
      if (!existingUser.password) {
        await this.emailVerificationsService.sendIsAlreadyRegisterWithProvider(email);
      }

      if (!existingUser.isEmailVerified) {
        await this.emailVerificationsService.sendVerificationEmail(email, existingUser.id);
      } else {
        await this.emailVerificationsService.sendIsAlreadyVerifiedEmail(email);
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.save({
        email: email,
        password: hashedPassword,
        role: 'user',
      });

      await this.authProvidersService.save({ provider: 'local', providerId: email, user: { id: user.id } });

      await this.emailVerificationsService.sendVerificationEmail(email, user.id);
    }

    return {
      message: 'Revise su correo y siga las instrucciones',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneBy({ email: email });
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
      where: { email: email },
      relations: { authProviders: true },
    });

    if (user) {
      const haveGoogleProvider = user.authProviders.some((authProvider) => authProvider.provider === 'google' && authProvider.providerId === sub);
      if (!haveGoogleProvider) {
        await this.authProvidersService.save({ provider: 'google', providerId: sub, user: { id: user.id } });
      }
    } else {
      user = await this.usersService.save({
        email,
        role: 'user',
      });
      await this.authProvidersService.save({ provider: 'google', providerId: sub, user: { id: user.id } });
      await this.profilesService.save({ name: name, picture: picture, userId: user.id });
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

    if (!verificationToken || verificationToken.user.isEmailVerified || new Date(verificationToken.expiresAt) < new Date()) {
      throw new BadRequestException();
    }

    const user = verificationToken.user;
    user.isEmailVerified = true;
    await this.usersService.save(user);

    await this.emailVerificationsService.delete({ userId: user.id });

    return { message: 'Correo verificado exitosamente' };
  }

  async sendVerification(email: string) {
    const user = await this.usersService.findOneBy({ email: email });

    if (!user) {
      throw new BadRequestException();
    }

    if (!user.isEmailVerified) {
      await this.emailVerificationsService.sendVerificationEmail(email, user.id);
    } else {
      await this.emailVerificationsService.sendIsAlreadyVerifiedEmail(email);
    }

    return { message: 'Código de verificación enviado' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneBy({ email: email });
    if (user) {
      await this.passwordResetTokensService.sendPasswordResetToken(email, user.id);
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
        await this.authProvidersService.save({ provider: 'local', providerId: user.email, user: { id: user.id } });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.usersService.save(user);

    await this.passwordResetTokensService.delete({ user: { id: user.id } });

    return { message: 'Contraseña actualizada correctamente' };
  }

  generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
