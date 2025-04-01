import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from '@/auth/modules/users/users.module';
import { ProfilesModule } from '@/auth/modules/profiles/profiles.module';
import { AuthProvidersModule } from '@/auth/modules/auth-providers/auth-providers.module';
import { EmailVerificationsModule } from '@/auth/modules/email-verification/email-verification.module';
import { PasswordResetTokensModule } from '@/auth/modules/password-reset-tokens/password-reset-tokens.module';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { jwtConfig } from '@/config/jwt.config';
import { mailerConfig } from '@/config/mailer.config';
import { GoogleOAuthProvider } from '@/config/google-client.config';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    AuthProvidersModule,
    EmailVerificationsModule,
    PasswordResetTokensModule,
    AuthProvidersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleOAuthProvider, AuthService],
})
export class AuthModule {}
