import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { CreateProductDto } from '@/admin/inventory/products/dto/create-product.dto';

class OldImageDto {
  @MinLength(1)
  @IsString()
  path: string;

  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    return plainToInstance(OldImageDto, JSON.parse(value));
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OldImageDto)
  oldImages?: OldImageDto[];
}
