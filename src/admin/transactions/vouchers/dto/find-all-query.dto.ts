import { IsDateString, IsIn, IsOptional } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsIn(['Compra', 'Venta'])
  type: 'Compra' | 'Venta';
}
