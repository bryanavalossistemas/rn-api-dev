import { CreateSupplierDto } from '@/admin/transactions/suppliers/dto/create-supplier.dto';
import { UpdateSupplierDto } from '@/admin/transactions/suppliers/dto/update-supplier.dto';
import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Not, Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { documentNumber, documentType, name } = createSupplierDto;
    const supplierExistsByDocument = await this.suppliersRepository.existsBy({ documentNumber: documentNumber });
    if (supplierExistsByDocument) {
      throw new ConflictException(`El proveedor con ${documentType} ${documentNumber} ya existe`);
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

  async findOneById(id: number) {
    const supplier = await this.suppliersRepository.findOneBy({ id });
    if (!supplier) {
      throw new NotFoundException();
    }

    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersRepository.preload({ id, ...updateSupplierDto });
    if (!supplier) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    const { name, documentType, documentNumber } = updateSupplierDto;
    const supplierExistsByName = await this.suppliersRepository.exists({ where: { name: name, id: Not(supplier.id) } });
    if (supplierExistsByName) {
      throw new ConflictException(`El proveedor con nombre ${name} ya existe`);
    }

    const supplierExistsByDocument = await this.suppliersRepository.exists({ where: { documentNumber: documentNumber, id: Not(supplier.id) } });
    if (supplierExistsByDocument) {
      throw new ConflictException(`El proveedor con ${documentType} ${documentNumber} ya existe`);
    }

    return await this.suppliersRepository.save(supplier);
  }

  async remove(id: number) {
    const result = await this.suppliersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return { message: 'Proveedor eliminado correctamente' };
  }
}
