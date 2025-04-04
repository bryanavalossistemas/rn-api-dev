import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => (value === '' ? null : value))
  description?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => (value === '' ? null : value))
  barCode?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => (value === '' ? null : value))
  sku?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => (value === '' ? null : value))
  measurementUnit?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string }) => parseFloat(value))
  measurementQuantity: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }: { value: string }) => parseInt(value))
  ecommercePercentageDiscount: number;

  @IsBoolean()
  @Transform(({ value }: { value: string }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
  })
  showInEcommerce: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string }) => parseFloat(value))
  salePrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }: { value: string }) => parseFloat(value))
  ecommerceSalePrice: number;

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
