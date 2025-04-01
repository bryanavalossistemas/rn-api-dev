import { IsValidDocument } from '@/admin/transactions/customers/dto/document-length.validator';
import { IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @MinLength(1)
  name: string;

  @IsIn(['RUC', 'DNI'])
  @IsNotEmpty()
  documentType: 'RUC' | 'DNI';

  @IsValidDocument()
  @IsNumberString()
  documentNumber: string;

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
