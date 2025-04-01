import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseDetail } from '@/admin/transactions/purchase-details/entities/purchase-detail.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectId, Repository } from 'typeorm';

@Injectable()
export class PurchaseDetailsService {
  constructor(
    @InjectRepository(PurchaseDetail)
    private readonly purchaseDetailsRepository: Repository<PurchaseDetail>,
  ) {}

  async save(entity: DeepPartial<PurchaseDetail>) {
    return await this.purchaseDetailsRepository.save(entity);
  }

  async findOne(options: FindOneOptions<PurchaseDetail>) {
    return await this.purchaseDetailsRepository.findOne(options);
  }

  async find(options?: FindManyOptions<PurchaseDetail> | undefined) {
    return await this.purchaseDetailsRepository.find(options);
  }

  async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<PurchaseDetail>) {
    return await this.purchaseDetailsRepository.delete(criteria);
  }
}
