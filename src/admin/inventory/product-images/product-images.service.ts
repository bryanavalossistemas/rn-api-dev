import { ProductImage } from '@/admin/inventory/product-images/entities/product-image.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectId, Repository } from 'typeorm';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  async save(productImage: DeepPartial<ProductImage>) {
    return await this.productImagesRepository.save(productImage);
  }

  async find(options?: FindManyOptions<ProductImage>) {
    return await this.productImagesRepository.find(options);
  }

  async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<ProductImage>) {
    return await this.productImagesRepository.delete(criteria);
  }
}
