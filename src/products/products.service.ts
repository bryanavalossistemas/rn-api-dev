import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProductImagesService } from '../product-images/product-images.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as sharp from 'sharp';
import { unlink } from 'fs/promises';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly productImagesService: ProductImagesService,
    private readonly configService: ConfigService,
  ) {}

  async save(product: DeepPartial<Product>) {
    return await this.productsRepository.save(product);
  }

  async create(createProductDto: CreateProductDto, images?: Array<Express.Multer.File>) {
    const product = await this.productsRepository.save(createProductDto);

    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = `${uuidv4()}.webp`;
        const outputPath = join(__dirname, '../..', 'uploads', fileName);

        await sharp(image.buffer).toFormat('webp').toFile(outputPath);

        await this.productImagesService.save({
          product: { id: product.id },
          path: this.configService.get('API_URL') + `/${fileName}`,
        });
      }
    }

    return await this.productsRepository.findOne({
      where: { id: product.id },
      relations: ['images'],
      order: { images: { id: 'DESC' } },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Product> = {
      relations: { images: true },
      order: { id: 'DESC', images: { id: 'DESC' } },
    };
    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }

    return await this.productsRepository.find(options);
  }

  async findOne(options: FindOneOptions<Product>) {
    const product = await this.productsRepository.findOne(options);
    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, images?: Array<Express.Multer.File>) {
    const product = await this.findOne({
      where: { id: id },
    });

    const { oldImages } = updateProductDto;
    if (oldImages && oldImages.length > 0) {
      const imagesToDelete = oldImages.filter((i) => i.deleted);
      for (const imageToDelete of imagesToDelete) {
        const filePath = join(__dirname, '../..', 'uploads', this.getFileNameFromUrl(imageToDelete.path));
        await unlink(filePath);
        await this.productImagesService.delete({ id: imageToDelete.id });
      }
    }

    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = `${uuidv4()}.webp`;
        const outputPath = join(__dirname, '../..', 'uploads', fileName);

        await sharp(image.buffer).toFormat('webp').toFile(outputPath);

        await this.productImagesService.save({
          product: { id: product.id },
          path: this.configService.get('API_URL') + `/${fileName}`,
        });
      }
    }

    Object.assign(product, updateProductDto);

    await this.productsRepository.save(product);

    return await this.productsRepository.findOne({
      where: { id: product.id },
      relations: ['images'],
      order: { images: { id: 'DESC' } },
    });
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException();
    }
    const images = await this.productImagesService.find({
      where: { product: { id: product.id } },
    });
    for (const image of images) {
      const filePath = join(__dirname, '../..', 'uploads', this.getFileNameFromUrl(image.path));
      await unlink(filePath);
    }

    await this.productsRepository.delete({ id: product.id });

    return { message: 'Producto eliminado correctamente' };
  }

  private getFileNameFromUrl(url: string): string {
    const fileNameFromUrl = url.split('/').pop();
    if (!fileNameFromUrl) {
      throw new BadRequestException();
    }
    return fileNameFromUrl;
  }
}
