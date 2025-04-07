import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { InventoryMovementsModule } from '@/admin/inventory/inventory-movements/inventory-movements.module';
import { VoucherDetailsModule } from '@/admin/transactions/voucher-details/voucher-details.module';
import { CustomersModule } from '@/admin/transactions/customers/customers.module';
import { ProductsModule } from '@/admin/inventory/products/products.module';
import { VouchersModule } from '@/admin/transactions/vouchers/vouchers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    CustomersModule,
    VoucherDetailsModule,
    ProductsModule,
    VoucherDetailsModule,
    InventoryMovementsModule,
    VouchersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
