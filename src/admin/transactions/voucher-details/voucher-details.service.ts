import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherDetail } from '@/admin/transactions/voucher-details/entities/voucher-detail.entity';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class VoucherDetailsService {
  constructor(
    @InjectRepository(VoucherDetail)
    private readonly voucherDetailsRepository: Repository<VoucherDetail>,
  ) {}

  async save(entity: DeepPartial<VoucherDetail>) {
    return await this.voucherDetailsRepository.save(entity);
  }

  async findOneById(id: VoucherDetail['id']) {
    const voucherDetail = await this.voucherDetailsRepository.findOneBy({ id });
    if (!voucherDetail) {
      throw new NotFoundException();
    }

    return voucherDetail;
  }

  async find(options?: FindManyOptions<VoucherDetail>) {
    return await this.voucherDetailsRepository.find(options);
  }

  async remove(entity: VoucherDetail) {
    return await this.voucherDetailsRepository.remove(entity);
  }
}
