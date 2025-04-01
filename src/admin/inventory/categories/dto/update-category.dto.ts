import { CreateCategoryDto } from '@/admin/inventory/categories/dto/create-category.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
