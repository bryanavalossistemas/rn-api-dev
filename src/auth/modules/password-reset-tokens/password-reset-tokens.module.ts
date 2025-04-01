import { PasswordResetToken } from '@/auth/modules/password-reset-tokens/entities/password-reset-token.entity';
import { PasswordResetTokensService } from '@/auth/modules/password-reset-tokens/password-reset-tokens.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  providers: [PasswordResetTokensService],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
