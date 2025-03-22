import { Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerification } from './entities/email-verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerification])],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationsModule {}
