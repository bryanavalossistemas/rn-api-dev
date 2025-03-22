import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectId, Repository } from 'typeorm';

@Injectable()
export class InventoryMovementsService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementsRepository: Repository<InventoryMovement>,
  ) {}

  async save(inventoryMovement: DeepPartial<InventoryMovement>) {
    return await this.inventoryMovementsRepository.save(inventoryMovement);
  }

  async find(options?: FindManyOptions<InventoryMovement>) {
    return await this.inventoryMovementsRepository.find(options);
  }

  async findOne(options: FindOneOptions<InventoryMovement>) {
    const inventoryMovement = await this.inventoryMovementsRepository.findOne(options);

    if (!inventoryMovement) {
      throw new NotFoundException();
    }

    return inventoryMovement;
  }

  async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<InventoryMovement>) {
    return await this.inventoryMovementsRepository.delete(criteria);
  }
}
