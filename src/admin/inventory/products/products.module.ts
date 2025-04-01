import { ProductImagesModule } from '@/admin/inventory/product-images/product-images.module';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { ProductsController } from '@/admin/inventory/products/products.controller';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ProductImagesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
