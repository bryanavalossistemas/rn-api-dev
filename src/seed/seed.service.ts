import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { User } from '@/auth/modules/users/entities/user.entity';
import { brandsData, categoriesData, customersData, measurementUnitsData, productsData, profilesData, suppliersData, usersData } from '@/seed/data';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(MeasurementUnit)
    private readonly measurementUnitsRepository: Repository<MeasurementUnit>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    await connection.synchronize();
  }

  async seed() {
    await this.usersRepository.save(usersData);

    await this.profilesRepository.save(profilesData);

    await this.suppliersRepository.save(suppliersData);

    await this.customersRepository.save(customersData);

    await this.categoriesRepository.save(categoriesData);

    await this.brandsRepository.save(brandsData);

    await this.measurementUnitsRepository.save(measurementUnitsData);

    await this.productsRepository.save(productsData);

    console.log('Seed completado');
  }
}
