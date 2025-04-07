import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDetailDto } from './create-voucher-detail.dto';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateVoucherDetailDto extends PartialType(CreateVoucherDetailDto) {
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @IsInt()
  @IsPositive()
  productId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  unitPrice: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
