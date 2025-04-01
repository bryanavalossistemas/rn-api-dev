import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { SuppliersController } from '@/admin/transactions/suppliers/suppliers.controller';
import { SuppliersService } from '@/admin/transactions/suppliers/suppliers.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
