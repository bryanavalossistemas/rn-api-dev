import { CreateVoucherDetailDto } from '@/admin/transactions/voucher-details/dto/create-voucher-detail.dto';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsPositive, ValidateNested } from 'class-validator';

export class CreateVoucherDto {
  @IsIn(['Compra', 'Venta'])
  type: 'Compra' | 'Venta';

  @IsIn(['Factura', 'Boleta'])
  documentType: 'Factura' | 'Boleta';

  @IsOptional()
  @IsInt()
  @IsPositive()
  supplierId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  customerId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVoucherDetailDto)
  voucherDetails: CreateVoucherDetailDto[];
}
