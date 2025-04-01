import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleDetail } from '@/admin/transactions/sale-details/entities/sale-detail.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class SaleDetailsService {
  constructor(
    @InjectRepository(SaleDetail)
    private readonly saleDetailsRepository: Repository<SaleDetail>,
  ) {}

  async save(saleDetail: DeepPartial<SaleDetail>) {
    return await this.saleDetailsRepository.save(saleDetail);
  }
}
