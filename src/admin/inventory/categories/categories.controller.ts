import { CategoriesService } from '@/admin/inventory/categories/categories.service';
import { CreateCategoryDto } from '@/admin/inventory/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/admin/inventory/categories/dto/update-category.dto';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('newImage'))
  async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() newImage?: Express.Multer.File) {
    return await this.categoriesService.create(createCategoryDto, newImage);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return await this.categoriesService.findAll(dateRange);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('newImage'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() newImage?: Express.Multer.File) {
    return await this.categoriesService.update(id, updateCategoryDto, newImage);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.remove(id);
  }
}
