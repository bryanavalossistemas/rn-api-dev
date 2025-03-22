import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Between, FindManyOptions, Not, Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { document, type, name } = createSupplierDto;
    const supplierExistsByDocument = await this.suppliersRepository.existsBy({ document });
    if (supplierExistsByDocument) {
      throw new ConflictException(`El proveedor con ${type === 'RUC' ? 'RUC' : 'DNI'} ${document} ya existe`);
    }
    const supplierExistsByName = await this.suppliersRepository.existsBy({ name });
    if (supplierExistsByName) {
      throw new ConflictException(`El proveedor con nombre ${name} ya existe`);
    }

    return await this.suppliersRepository.save(createSupplierDto);
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Supplier> = {
      order: { id: 'DESC' },
    };

    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }

    return await this.suppliersRepository.find(options);
  }

  async findOne(id: number) {
    const supplier = await this.suppliersRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException();
    }

    const { name, type, document } = updateSupplierDto;
    const supplierExistsByName = await this.suppliersRepository.exists({ where: { name: name, id: Not(supplier.id) } });
    if (supplierExistsByName) {
      throw new ConflictException(`El proveedor con nombre ${name} ya existe`);
    }

    const supplierExistsByDocument = await this.suppliersRepository.exists({ where: { document: document, id: Not(supplier.id) } });
    if (supplierExistsByDocument) {
      throw new ConflictException(`El proveedor con ${type === 'RUC' ? 'RUC' : 'DNI'} ${document} ya existe`);
    }

    Object.assign(supplier, updateSupplierDto);

    return await this.suppliersRepository.save(supplier);
  }

  async remove(id: number) {
    await this.suppliersRepository.delete({ id: id });

    return { message: 'Proveedor eliminado correctamente' };
  }
}
