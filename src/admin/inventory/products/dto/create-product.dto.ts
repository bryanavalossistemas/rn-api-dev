import { IsInt, IsNumber, IsOptional, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @MinLength(1)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string }) => parseFloat(value))
  salePrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string }) => parseFloat(value))
  costPrice: number;

  @IsInt()
  @Min(0)
  @Transform(({ value }: { value: string }) => parseInt(value))
  stock: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: string }) => {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value, 10);
  })
  categoryId?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: string }) => {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value, 10);
  })
  brandId?: number | null;
}
