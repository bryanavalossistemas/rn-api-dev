import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Query, Delete } from '@nestjs/common';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { SalesService } from '@/admin/transactions/sales/sales.service';
import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';
import { UpdateSaleDto } from '@/admin/transactions/sales/dto/update-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    return await this.salesService.create(createSaleDto);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.salesService.findAll(dateRange);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.salesService.remove(id);
  }
}
