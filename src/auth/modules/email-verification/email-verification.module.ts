import { EmailVerificationService } from '@/auth/modules/email-verification/email-verification.service';
import { EmailVerification } from '@/auth/modules/email-verification/entities/email-verification.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerification])],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationsModule {}
