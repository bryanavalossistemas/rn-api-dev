import { CreateBrandDto } from '@/admin/inventory/brands/dto/create-brand.dto';
import { UpdateBrandDto } from '@/admin/inventory/brands/dto/update-brand.dto';
import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    return await this.brandsRepository.save(createBrandDto);
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Brand> = {};
    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }

    return await this.brandsRepository.find(options);
  }

  async findOne(id: number) {
    const brand = await this.brandsRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandsRepository.preload({ id, ...updateBrandDto });
    if (!brand) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    return await this.brandsRepository.save(brand);
  }

  async remove(id: number) {
    const result = await this.brandsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return { message: 'Marca eliminada correctamente' };
  }
}
