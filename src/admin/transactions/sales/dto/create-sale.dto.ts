import { CreateVoucherDetailDto } from '@/admin/transactions/voucher-details/dto/create-voucher-detail.dto';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsPositive, ValidateNested } from 'class-validator';

export class CreateSaleDto {
  @IsIn(['Factura', 'Boleta'])
  documentType: 'Factura' | 'Boleta';

  @IsInt()
  @IsPositive()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVoucherDetailDto)
  voucherDetails: CreateVoucherDetailDto[];
}
