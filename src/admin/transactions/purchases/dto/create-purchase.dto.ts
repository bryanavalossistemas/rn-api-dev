import { CreatePurchaseDetailDto } from '@/admin/transactions/purchase-details/dto/create-purchase-detail.dto';
import { Type } from 'class-transformer';
import { IsArray, IsInt, MinLength, ValidateNested } from 'class-validator';

export class CreatePurchaseDto {
  @MinLength(1)
  documentType: 'Factura' | 'Boleta';

  @IsInt()
  supplierId: number;

  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  purchaseDetails: CreatePurchaseDetailDto[];
}
