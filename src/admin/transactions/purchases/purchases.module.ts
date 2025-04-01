import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '@/admin/transactions/purchases/entities/purchase.entity';
import { PurchasesController } from '@/admin/transactions/purchases/purchases.controller';
import { PurchasesService } from '@/admin/transactions/purchases/purchases.service';
import { ProductsModule } from '@/admin/inventory/products/products.module';
import { InventoryMovementsModule } from '@/admin/inventory/inventory-movements/inventory-movements.module';
import { SuppliersModule } from '@/admin/transactions/suppliers/suppliers.module';
import { PurchaseDetailsModule } from '@/admin/transactions/purchase-details/purchase-details.module';
import { SaleDetailsModule } from '@/admin/transactions/sale-details/sale-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    ProductsModule,
    InventoryMovementsModule,
    SuppliersModule,
    PurchaseDetailsModule,
    SaleDetailsModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
