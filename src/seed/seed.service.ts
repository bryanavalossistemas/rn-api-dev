import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../auth/modules/roles/entities/role.entity';
import { User } from '../auth/modules/users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { brandsData, categoriesData, documentTypesData, productsData, rolesData, suppliersData, usersData } from './data';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';
import { DocumentType } from '../document-types/entities/document-type.entity';

@Injectable()
export class SeedService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(DocumentType)
    private readonly documentTypesRepository: Repository<DocumentType>,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    await connection.synchronize();
  }

  async seed() {
    await this.rolesRepository.save(rolesData);

    await this.usersRepository.save(usersData);

    await this.categoriesRepository.save(categoriesData);

    await this.brandsRepository.save(brandsData);

    await this.suppliersRepository.save(suppliersData);

    await this.productsRepository.save(productsData);

    await this.documentTypesRepository.save(documentTypesData);

    console.log('Seed completado');
  }
}
