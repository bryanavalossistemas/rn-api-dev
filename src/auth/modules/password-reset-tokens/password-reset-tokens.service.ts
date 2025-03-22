import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async save(entities: DeepPartial<PasswordResetToken>) {
    return await this.passwordResetTokenRepository.save(entities);
  }

  async findOne(options: FindOneOptions<PasswordResetToken>) {
    return await this.passwordResetTokenRepository.findOne(options);
  }

  async delete(criteria: FindOptionsWhere<PasswordResetToken>) {
    return await this.passwordResetTokenRepository.delete(criteria);
  }

  async sendPasswordResetToken(email: string, user: User) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.passwordResetTokenRepository.save({
      token,
      user,
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
