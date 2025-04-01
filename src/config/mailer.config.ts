import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const mailerConfig = (configService: ConfigService): MailerOptions => ({
  transport: {
    host: configService.get<string>('EMAIL_HOST'),
    port: configService.get<number>('EMAIL_PORT'),
    auth: {
      user: configService.get<string>('EMAIL_USERNAME'),
      pass: configService.get<string>('EMAIL_PASSWORD'),
    },
  },
});
