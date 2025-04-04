import { CreateCategoryDto } from '@/admin/inventory/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/admin/inventory/categories/dto/update-category.dto';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, newImage?: Express.Multer.File) {
    const category = this.categoriesRepository.create(createCategoryDto);

    if (newImage) {
      const fileName = `${uuidv4()}.webp`;
      const path = `uploads/${fileName}`;
      await sharp(newImage.buffer).toFormat('webp').toFile(path);

      category.image = fileName;
    }

    return await this.categoriesRepository.save(category);
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto, newImage?: Express.Multer.File) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    const { name, image } = updateCategoryDto;

    if (name) category.name = name;

    const imageExists = category.image;

    if (newImage) {
      if (imageExists) {
        const fileName = imageExists;
        await unlink(`uploads/${fileName}`);
      }
      const fileName = `${uuidv4()}.webp`;
      const path = `uploads/${fileName}`;
      await sharp(newImage.buffer).toFormat('webp').toFile(path);

      category.image = fileName;
    } else {
      if (imageExists && image === null) {
        const fileName = imageExists;
        await unlink(`uploads/${fileName}`);
      }

      category.image = image;
    }

    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException();
    }
    const fileName = category.image;
    await unlink(`uploads/${fileName}`);

    await this.categoriesRepository.remove(category);

    return { message: 'Categoría eliminada correctamente' };
  }
}
