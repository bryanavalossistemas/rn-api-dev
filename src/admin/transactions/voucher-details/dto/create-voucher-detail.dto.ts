import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateVoucherDetailDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  unitPrice: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
