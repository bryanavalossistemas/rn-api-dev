import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsArray, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVoucherDetailDto } from '@/admin/transactions/voucher-details/dto/update-voucher-detail.dto';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
  @IsIn(['Compra', 'Venta'])
  type: 'Compra' | 'Venta';

  @IsIn(['Factura', 'Boleta'])
  documentType: 'Factura' | 'Boleta';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVoucherDetailDto)
  voucherDetails: UpdateVoucherDetailDto[];
}
