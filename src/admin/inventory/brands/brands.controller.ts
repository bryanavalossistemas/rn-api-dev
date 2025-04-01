import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { BrandsService } from '@/admin/inventory/brands/brands.service';
import { UpdateBrandDto } from '@/admin/inventory/brands/dto/update-brand.dto';
import { CreateBrandDto } from '@/admin/inventory/brands/dto/create-brand.dto';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return await this.brandsService.create(createBrandDto);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.brandsService.findAll(dateRange);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.brandsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBrandDto: UpdateBrandDto) {
    return await this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.brandsService.remove(id);
  }
}
