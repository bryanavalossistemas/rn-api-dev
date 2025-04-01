import { InventoryMovementsModule } from '@/admin/inventory/inventory-movements/inventory-movements.module';
import { ProductsModule } from '@/admin/inventory/products/products.module';
import { CustomersModule } from '@/admin/transactions/customers/customers.module';
import { SaleDetailsModule } from '@/admin/transactions/sale-details/sale-details.module';
import { Sale } from '@/admin/transactions/sales/entities/sale.entity';
import { SalesController } from '@/admin/transactions/sales/sales.controller';
import { SalesService } from '@/admin/transactions/sales/sales.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), ProductsModule, InventoryMovementsModule, CustomersModule, SaleDetailsModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
