import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { ProductsModule } from '@/admin/inventory/products/products.module';
import { InventoryMovementsModule } from '@/admin/inventory/inventory-movements/inventory-movements.module';
import { VoucherDetailsModule } from '@/admin/transactions/voucher-details/voucher-details.module';
import { SuppliersModule } from '@/admin/transactions/suppliers/suppliers.module';
import { VouchersModule } from '@/admin/transactions/vouchers/vouchers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase]), SuppliersModule, VouchersModule, ProductsModule, VoucherDetailsModule, InventoryMovementsModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
