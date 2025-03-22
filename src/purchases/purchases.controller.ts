import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Request } from 'express';
import { FindAllQueryDto } from './dto/find-all-query.dto';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  async create(@Req() request: Request, @Body() createPurchaseDto: CreatePurchaseDto) {
    return await this.purchasesService.create(createPurchaseDto, request?.user?.sub || 1);
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.purchasesService.remove(id);
  }
}
