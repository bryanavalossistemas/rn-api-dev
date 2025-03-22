import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../auth/modules/roles/entities/role.entity';
import { User } from '../auth/modules/users/entities/user.entity';
import { SeedService } from './seed.service';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { AppModule } from '../app.module';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([User, Role, Category, Brand, Supplier, Product, DocumentType])],
  providers: [SeedService],
})
export class SeedModule {}
