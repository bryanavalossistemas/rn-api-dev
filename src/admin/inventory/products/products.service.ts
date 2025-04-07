import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { unlink } from 'fs/promises';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { ProductImagesService } from '@/admin/inventory/product-images/product-images.service';
import { CreateProductDto } from '@/admin/inventory/products/dto/create-product.dto';
import { UpdateProductDto } from '@/admin/inventory/products/dto/update-product.dto';
import { ProductUpdatesGateway } from '@/websotckets/product-updates.gateway';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productImagesService: ProductImagesService,
    private readonly productUpdatesGateway: ProductUpdatesGateway,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async save(product: DeepPartial<Product>) {
    return await this.productsRepository.save(product);
  }

  async create(createProductDto: CreateProductDto, newImages?: Array<Express.Multer.File>) {
    const product = await this.productsRepository.save(createProductDto);

    if (newImages && newImages.length > 0) {
      for (const image of newImages) {
        const fileName = `${uuidv4()}.webp`;
        await sharp(image.buffer).toFormat('webp').toFile(`uploads/${fileName}`);

        await this.productImagesService.save({
          productId: product.id,
          path: fileName,
        });
      }
    }

    this.triggerNetlifyRebuild().catch((error) => console.error('Error al disparar rebuild en Netlify:', error));

    return await this.productsRepository.findOne({
      where: { id: product.id },
      relations: { images: true },
    });
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;
    const options: FindManyOptions<Product> = {
      relations: { images: true, category: true },
      order: { id: 'DESC' },
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

  async findOneById(id: Product['id']) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, newImages?: Array<Express.Multer.File>) {
    const { images, ...rest } = updateProductDto;

    const product = await this.productsRepository.preload({ id, ...rest });

    if (!product) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    if (images && images.length > 0) {
      const imagesToDelete = images.filter((i) => i.deleted);
      for (const imageToDelete of imagesToDelete) {
        const filePath = `uploads/${imageToDelete.path}`;
        await unlink(filePath);
        await this.productImagesService.delete({ id: imageToDelete.id });
      }
    }

    if (newImages && newImages.length > 0) {
      for (const image of newImages) {
        const fileName = `${uuidv4()}.webp`;
        const outputPath = `uploads/${fileName}`;

        await sharp(image.buffer).toFormat('webp').toFile(outputPath);

        await this.productImagesService.save({
          productId: product.id,
          path: fileName,
        });
      }
    }

    await this.productsRepository.save(product);

    const updatedProduct = await this.findOne({
      where: { id: product.id },
      relations: { images: true },
    });

    this.productUpdatesGateway.notifyProductUpdate(updatedProduct.id, updatedProduct);

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException();
    }
    const images = await this.productImagesService.find({
      where: { productId: product.id },
    });
    for (const image of images) {
      const filePath = `uploads/${image.path}`;
      await unlink(filePath);
    }

    await this.productsRepository.delete({ id: product.id });

    return { message: 'Producto eliminado correctamente' };
  }

  private async triggerNetlifyRebuild() {
    const NETLIFY_WEBHOOK = this.configService.get<string>('NETLIFY_WEBHOOK')!;
    await firstValueFrom(this.httpService.post(NETLIFY_WEBHOOK, {}, { timeout: 3000 }));
  }
}
