import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@auth/guards/roles.guard';
import { AuthGuard } from '@auth/guards/auth.guard';
import { CategoriesModule } from '@admin/inventory/categories/categories.module';
import { BrandsModule } from '@/admin/inventory/brands/brands.module';
import { ProductsModule } from '@admin/inventory/products/products.module';
import { ProductImagesModule } from '@admin/inventory/product-images/product-images.module';
import { SuppliersModule } from '@admin/transactions/suppliers/suppliers.module';
import { InventoryMovementsModule } from '@admin/inventory/inventory-movements/inventory-movements.module';
import { CustomersModule } from '@admin/transactions/customers/customers.module';
import { typeOrmConfig } from '@/config/typeorm.config';
import { MeasurementUnitsModule } from '@/admin/inventory/measurement-units/measurement-units.module';
import { VouchersModule } from '@/admin/transactions/vouchers/vouchers.module';
import { VoucherDetailsModule } from '@/admin/transactions/voucher-details/voucher-details.module';
import { PurchasesModule } from '@/admin/transactions/purchases/purchases.module';
import { SalesModule } from '@/admin/transactions/sales/sales.module';
import { SunatModule } from './sunat/sunat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    ProductImagesModule,
    SuppliersModule,
    InventoryMovementsModule,
    CustomersModule,
    MeasurementUnitsModule,
    VouchersModule,
    VoucherDetailsModule,
    PurchasesModule,
    SalesModule,
    SunatModule,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
