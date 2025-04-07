import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';
import { VouchersService } from '@/admin/transactions/vouchers/vouchers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher])],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
