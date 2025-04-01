import { Module } from '@nestjs/common';
import { SaleDetailsService } from './sale-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleDetail } from '@/admin/transactions/sale-details/entities/sale-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleDetail])],
  providers: [SaleDetailsService],
  exports: [SaleDetailsService],
})
export class SaleDetailsModule {}
