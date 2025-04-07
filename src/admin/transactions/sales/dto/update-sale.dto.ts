import { PartialType } from '@nestjs/mapped-types';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVoucherDetailDto } from '@/admin/transactions/voucher-details/dto/update-voucher-detail.dto';
import { CreateSaleDto } from '@/admin/transactions/sales/dto/create-sale.dto';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVoucherDetailDto)
  voucherDetails: UpdateVoucherDetailDto[];
}
