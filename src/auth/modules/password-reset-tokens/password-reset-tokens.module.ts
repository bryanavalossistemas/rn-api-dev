import { Module } from '@nestjs/common';
import { PasswordResetTokensService } from './password-reset-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  providers: [PasswordResetTokensService],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
