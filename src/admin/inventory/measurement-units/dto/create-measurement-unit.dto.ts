import { MinLength } from 'class-validator';

export class CreateMeasurementUnitDto {
  @MinLength(1)
  name: string;

  @MinLength(1)
  prefix: string;
}
