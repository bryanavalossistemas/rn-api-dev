import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { DocumentsModule } from '../documents/documents.module';
import { ProductsModule } from '../products/products.module';
import { InventoryMovementsModule } from '../inventory-movements/inventory-movements.module';
import { DocumentDetailsModule } from '../document-details/document-details.module';
import { SuppliersModule } from '../suppliers/suppliers.module';
import { DocumentTypesModule } from '../document-types/document-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    DocumentsModule,
    ProductsModule,
    InventoryMovementsModule,
    DocumentDetailsModule,
    SuppliersModule,
    DocumentTypesModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
