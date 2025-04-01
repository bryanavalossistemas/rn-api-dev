import { Module } from '@nestjs/common';
import { PurchaseDetailsService } from './purchase-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseDetail } from '@/admin/transactions/purchase-details/entities/purchase-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseDetail])],
  providers: [PurchaseDetailsService],
  exports: [PurchaseDetailsService],
})
export class PurchaseDetailsModule {}
