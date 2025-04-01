import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from '@/admin/inventory/brands/brands.service';
import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { BrandsController } from '@/admin/inventory/brands/brands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
