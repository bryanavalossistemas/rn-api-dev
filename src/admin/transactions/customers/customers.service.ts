import { CreateCustomerDto } from '@/admin/transactions/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/admin/transactions/customers/dto/update-customer.dto';
import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Not, Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { name, documentType, documentNumber } = createCustomerDto;
    const customerExistsByDocument = await this.customersRepository.existsBy({ documentType: documentType });
    if (customerExistsByDocument) {
      throw new ConflictException(`El cliente con ${documentType} ${documentNumber} ya existe`);
    }
    const cutomerExistsByName = await this.customersRepository.existsBy({ name: name });
    if (cutomerExistsByName) {
      throw new ConflictException(`El cliente con nombre ${name} ya existe`);
    }

    return await this.customersRepository.save(createCustomerDto);
  }

  async findAll(dateRange: { startDate?: Date; endDate?: Date }) {
    const { startDate, endDate } = dateRange;

    const options: FindManyOptions<Customer> = {
      order: { id: 'DESC' },
    };

    if (startDate && endDate) {
      options.where = { createdAt: Between(startDate, endDate) };
    }

    return await this.customersRepository.find(options);
  }

  async findOneById(id: number) {
    const customer = await this.customersRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException();
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customersRepository.preload({ id, ...updateCustomerDto });
    if (!customer) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    const { name, documentType, documentNumber } = updateCustomerDto;
    const customerrExistsByName = await this.customersRepository.exists({ where: { name: name, id: Not(customer.id) } });
    if (customerrExistsByName) {
      throw new ConflictException(`El cliente con nombre ${name} ya existe`);
    }

    const customerExistsByDocument = await this.customersRepository.exists({ where: { documentNumber: documentNumber, id: Not(customer.id) } });
    if (customerExistsByDocument) {
      throw new ConflictException(`El cliente con ${documentType} ${documentNumber} ya existe`);
    }

    return await this.customersRepository.save(customer);
  }

  async remove(id: number) {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return { message: 'Cliente eliminado correctamente' };
  }
}
