import { ProductImage } from '@/admin/inventory/product-images/entities/product-image.entity';
import { ProductImagesService } from '@/admin/inventory/product-images/product-images.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  providers: [ProductImagesService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
