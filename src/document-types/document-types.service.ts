import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from './entities/document-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DocumentTypesService {
  constructor(
    @InjectRepository(DocumentType)
    private readonly documentTypesRepository: Repository<DocumentType>,
  ) {}

  async findById(id: number) {
    const documentType = await this.documentTypesRepository.findOneBy({ id: id });
    if (!documentType) {
      throw new NotFoundException();
    }

    return documentType;
  }
}
