import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @MinLength(1)
  name: string;

  @Transform(({ value }: { value: string }) => (value === 'null' ? null : value))
  @IsOptional()
  @IsString()
  description?: string | null;

  @Transform(({ value }: { value: string }) => (value === 'null' ? null : value))
  @IsOptional()
  @IsString()
  barCode?: string | null;

  @Transform(({ value }: { value: string }) => (value === 'null' ? null : value))
  @IsOptional()
  @IsString()
  sku?: string | null;

  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseInt(value, 10);
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  measurementUnitId?: number | null;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseFloat(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  measurementQuantity?: number | null;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseFloat(value);
  })
  @IsNumber()
  @Min(0)
  ecommercePercentageDiscount?: number | null;

  @Transform(({ value }: { value: string }) => {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
  })
  @IsBoolean()
  showInEcommerce: boolean;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salePrice: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseFloat(value);
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  ecommerceSalePrice?: number | null;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice: number;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsInt()
  @Min(0)
  stock: number;

  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseInt(value, 10);
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number | null;

  @Transform(({ value }: { value: string }) => {
    if (value === 'null') {
      return null;
    }
    return parseInt(value, 10);
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  brandId?: number | null;
}
