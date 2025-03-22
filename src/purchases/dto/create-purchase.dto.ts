import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { CreateDocumentDetailDto } from '../../document-details/dto/create-document-detail.dto';

export class CreatePurchaseDto {
  @IsInt()
  documentTypeId: number;

  @IsInt()
  supplierId: number;

  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentDetailDto)
  documentDetails: CreateDocumentDetailDto[];
}
