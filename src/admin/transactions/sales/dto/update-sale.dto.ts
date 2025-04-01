import { PartialType } from '@nestjs/mapped-types';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';
import { UpdateSaleDetailDto } from '@/admin/transactions/sale-details/dto/update-sale-detail.dto';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleDetailDto)
  saleDetails: UpdateSaleDetailDto[];
}
