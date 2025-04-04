import { CreateCategoryDto } from '@/admin/inventory/categories/dto/create-category.dto';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === 'null' ? null : value))
  image: string | null;
}
