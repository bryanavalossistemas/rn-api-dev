import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './entities/email-verification.entity';
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async save(emailVerification: DeepPartial<EmailVerification>) {
    return await this.emailVerificationRepository.save(emailVerification);
  }

  async findOne(options: FindOneOptions<EmailVerification>) {
    return await this.emailVerificationRepository.findOne(options);
  }

  async delete(criteria: FindOptionsWhere<EmailVerification>) {
    return await this.emailVerificationRepository.delete(criteria);
  }

  async sendIsAlreadyRegisterWithProvider(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Usted ya tiene una cuenta con google',
      text: `Usted ya tiene una cuenta con google`,
      html: `<p>Usted ya tiene una cuenta con google</p>`,
    });
  }

  async sendIsAlreadyVerifiedEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Cuenta ya verificada',
      text: `Tu cuenta ya está verificada`,
      html: `<p>Tu cuenta ya está verificada</p>`,
    });
  }

  async sendVerificationEmail(email: string, user: User) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailVerificationRepository.save({
      token,
      user,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verifica tu cuenta',
      text: `Tu código de verificación es: ${token}`,
      html: `<p>Haz click <a href="${this.configService.get('FRONTEND_URL')}/auth/verify-email">aquí</a> e Ingrea tu código de verificación: <strong>${token}</strong></p>`,
    });
  }
}
