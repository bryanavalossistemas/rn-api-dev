import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDetailDto } from './create-document-detail.dto';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateDocumentDetailDto extends PartialType(CreateDocumentDetailDto) {
  @IsOptional()
  @IsInt({ message: 'El productId debe ser un número entero.' })
  @IsPositive({ message: 'El productId debe ser un número positivo.' })
  id?: number;

  @IsInt({ message: 'El productId debe ser un número entero.' })
  @IsPositive({ message: 'El productId debe ser un número positivo.' })
  productId: number;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio unitario debe ser un número.' })
  @IsPositive({ message: 'El precio unitario debe ser un número positivo.' })
  unitPrice: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
