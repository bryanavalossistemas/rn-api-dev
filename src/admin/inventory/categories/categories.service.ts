import { CreateCategoryDto } from '@/admin/inventory/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/admin/inventory/categories/dto/update-category.dto';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.save(createCategoryDto);
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Category> = { order: { id: 'DESC' } };
    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }

    return await this.categoriesRepository.find(options);
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.preload({ id, ...updateCategoryDto });
    if (!category) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return { message: 'Categoría eliminada correctamente' };
  }
}
