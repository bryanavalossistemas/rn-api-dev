import { CreateSaleDetailDto } from '@/admin/transactions/sale-details/dto/create-sale-detail.dto';
import { Type } from 'class-transformer';
import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { MinLength } from 'class-validator';

export class CreateSaleDto {
  @MinLength(1)
  documentType: 'Factura' | 'Boleta';

  @IsInt()
  customerId: number;

  @IsArray({ message: 'documentDetails debe ser un array.' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  saleDetails: CreateSaleDetailDto[];
}
