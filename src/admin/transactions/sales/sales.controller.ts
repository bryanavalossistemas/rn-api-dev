import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';
import { UpdateSaleDto } from '@/admin/transactions/sales/dto/update-sale.dto';
import { SalesService } from '@/admin/transactions/sales/sales.service';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

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
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
