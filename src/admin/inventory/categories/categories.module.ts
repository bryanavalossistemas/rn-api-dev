import { CategoriesController } from '@/admin/inventory/categories/categories.controller';
import { CategoriesService } from '@/admin/inventory/categories/categories.service';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
