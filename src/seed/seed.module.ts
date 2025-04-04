import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { AppModule } from '@/app.module';
import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { User } from '@/auth/modules/users/entities/user.entity';
import { SeedService } from '@/seed/seed.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([User, Profile, Category, Brand, Supplier, Customer, Product, MeasurementUnit])],
  providers: [SeedService],
})
export class SeedModule {}
