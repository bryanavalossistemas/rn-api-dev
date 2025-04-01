import { CreateProductDto } from '@/admin/inventory/products/dto/create-product.dto';
import { UpdateProductDto } from '@/admin/inventory/products/dto/update-product.dto';
import { ProductsService } from '@/admin/inventory/products/products.service';
import { FindAllQueryDto } from '@/common/dto/find-all-query.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(@UploadedFiles() images: Array<Express.Multer.File>, @Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto, images);
  }

  @Get()
  async findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    const { startDate, endDate } = findAllQueryDto;
    const dateRange = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return await this.productsService.findAll(dateRange);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto, images);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
