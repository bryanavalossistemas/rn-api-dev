import { PartialType } from '@nestjs/mapped-types';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseDto } from '@/admin/transactions/purchases/dto/create-purchase.dto';
import { UpdatePurchaseDetailDto } from '@/admin/transactions/purchase-details/dto/update-purchase-detail.dto';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseDetailDto)
  purchaseDetails: UpdatePurchaseDetailDto[];
}
