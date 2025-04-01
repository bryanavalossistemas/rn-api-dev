import { CustomersController } from '@/admin/transactions/customers/customers.controller';
import { CustomersService } from '@/admin/transactions/customers/customers.service';
import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
