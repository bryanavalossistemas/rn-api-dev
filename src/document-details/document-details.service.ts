import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentDetail } from './entities/document-detail.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectId, Repository } from 'typeorm';

@Injectable()
export class DocumentDetailsService {
  constructor(
    @InjectRepository(DocumentDetail)
    private readonly documentDetailsRepository: Repository<DocumentDetail>,
  ) {}

  async save(documentDetail: DeepPartial<DocumentDetail>) {
    return await this.documentDetailsRepository.save(documentDetail);
  }

  async remove(entities: DocumentDetail[]) {
    return await this.documentDetailsRepository.remove(entities);
  }

  async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<DocumentDetail>) {
    return await this.documentDetailsRepository.delete(criteria);
  }

  async find(options?: FindManyOptions<DocumentDetail>) {
    return await this.documentDetailsRepository.find(options);
  }

  async findOne(options: FindOneOptions<DocumentDetail>) {
    return await this.documentDetailsRepository.findOne(options);
  }
}
