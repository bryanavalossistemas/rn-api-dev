import { CreatePurchaseDto } from '@/admin/transactions/purchases/dto/create-purchase.dto';
import { UpdatePurchaseDto } from '@/admin/transactions/purchases/dto/update-purchase.dto';
import { PurchasesService } from '@/admin/transactions/purchases/purchases.service';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  async create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return await this.purchasesService.create(createPurchaseDto);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.purchasesService.findAll(dateRange);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return await this.purchasesService.update(id, updatePurchaseDto);
  }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   return await this.purchasesService.remove(id);
  // }
}
