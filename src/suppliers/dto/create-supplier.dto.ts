import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, MinLength } from 'class-validator';
import { IsValidDocument } from './document-length.validator';

export class CreateSupplierDto {
  @MinLength(1)
  name: string;

  @IsIn(['RUC', 'DNI'])
  @IsNotEmpty()
  type: 'RUC' | 'DNI';

  @IsValidDocument()
  @IsNumberString()
  document: string;

  @IsOptional()
  @MinLength(1)
  address: string;

  @IsOptional()
  @MinLength(7)
  phone: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
