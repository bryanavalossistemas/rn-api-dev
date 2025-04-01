import { CustomersService } from '@/admin/transactions/customers/customers.service';
import { CreateCustomerDto } from '@/admin/transactions/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/admin/transactions/customers/dto/update-customer.dto';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.customersService.findAll(dateRange);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
    return await this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.customersService.remove(id);
  }
}
