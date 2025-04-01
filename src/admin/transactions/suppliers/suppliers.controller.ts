import { CreateSupplierDto } from '@/admin/transactions/suppliers/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@/admin/transactions/suppliers/dto/update-supplier.dto';
import { SuppliersService } from '@/admin/transactions/suppliers/suppliers.service';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return await this.suppliersService.create(createSupplierDto);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.suppliersService.findAll(dateRange);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSupplierDto: UpdateSupplierDto) {
    return await this.suppliersService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.suppliersService.remove(id);
  }
}
