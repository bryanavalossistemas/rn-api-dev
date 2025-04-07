import { VoucherDetail } from '@/admin/transactions/voucher-details/entities/voucher-detail.entity';
import { VoucherDetailsService } from '@/admin/transactions/voucher-details/voucher-details.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([VoucherDetail])],
  providers: [VoucherDetailsService],
  exports: [VoucherDetailsService],
})
export class VoucherDetailsModule {}
