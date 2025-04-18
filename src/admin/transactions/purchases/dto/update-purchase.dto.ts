import { PartialType } from '@nestjs/mapped-types';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVoucherDetailDto } from '@/admin/transactions/voucher-details/dto/update-voucher-detail.dto';
import { CreatePurchaseDto } from '@/admin/transactions/purchases/dto/create-purchase.dto';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVoucherDetailDto)
  voucherDetails: UpdateVoucherDetailDto[];
}
