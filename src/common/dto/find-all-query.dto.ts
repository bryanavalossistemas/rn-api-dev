import { IsDateString, IsOptional } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
