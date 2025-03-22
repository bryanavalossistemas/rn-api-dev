import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { InventoryMovementsModule } from './inventory-movements/inventory-movements.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { DocumentDetailsModule } from './document-details/document-details.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: 'database.sqlite',
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    ProductImagesModule,
    SuppliersModule,
    InventoryMovementsModule,
    PurchasesModule,
    DocumentsModule,
    DocumentTypesModule,
    DocumentDetailsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
