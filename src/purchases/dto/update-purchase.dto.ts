import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDocumentDetailDto } from '../../document-details/dto/update-document-detail.dto';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentDetailDto)
  documentDetails: UpdateDocumentDetailDto[];
}
