import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DeepPartial, FindOneOptions, FindOptionsWhere, ObjectId, Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async save(document: DeepPartial<Document>) {
    return await this.documentsRepository.save(document);
  }

  async countByDocumentTypeId(documentTypeId: number) {
    return await this.documentsRepository.countBy({
      documentType: { id: documentTypeId },
    });
  }

  async findOne(options: FindOneOptions<Document>) {
    const document = await this.documentsRepository.findOne(options);
    if (!document) {
      throw new NotFoundException();
    }

    return document;
  }

  async delete(criteria: string | number | FindOptionsWhere<Document> | Date | ObjectId | string[] | number[] | Date[] | ObjectId[]) {
    return await this.documentsRepository.delete(criteria);
  }
}
