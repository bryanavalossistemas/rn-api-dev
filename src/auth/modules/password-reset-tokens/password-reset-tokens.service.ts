import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PasswordResetToken } from '@/auth/modules/password-reset-tokens/entities/password-reset-token.entity';
import { User } from '@/auth/modules/users/entities/user.entity';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async findOne(options: FindOneOptions<PasswordResetToken>) {
    return await this.passwordResetTokenRepository.findOne(options);
  }

  async delete(criteria: FindOptionsWhere<PasswordResetToken>) {
    return await this.passwordResetTokenRepository.delete(criteria);
  }

  async sendPasswordResetToken(email: string, userId: User['id']) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.passwordResetTokenRepository.save({
      token: token,
      userId: userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recupera tu cuenta',
      text: `Tu código de recuperacion es: ${token}`,
      html: `<p>Haz click <a href="${this.configService.get('FRONTEND_URL')}/auth/reset-password">aquí</a> e ingresa tu nueva contraseña y tu código de recuperación: <strong>${token}</strong></p>`,
    });
  }
}
