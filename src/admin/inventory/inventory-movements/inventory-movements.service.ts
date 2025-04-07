import { InventoryMovement } from '@/admin/inventory/inventory-movements/entities/inventory-movement.entity';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getAverageCost(productId: Product['id'], untilDate: Date): Promise<number> {
    const result = await this.inventoryMovementsRepository
      .createQueryBuilder('m')
      .select('SUM(m.quantity * m.unitCost)', 'totalCost')
      .addSelect('SUM(m.quantity)', 'totalQuantity')
      .where('m.productId = :productId', { productId })
      .andWhere('m.movementType = :type', { type: 'IN' })
      .andWhere('m.createdAt <= :untilDate', { untilDate })
      .getRawOne();

    const totalCost = parseFloat(result.totalCost || 0);
    const totalQuantity = parseFloat(result.totalQuantity || 0);

    if (totalQuantity === 0) {
      throw new Error('No stock available to calculate average cost');
    }

    return parseFloat((totalCost / totalQuantity).toFixed(2));
  }
}
