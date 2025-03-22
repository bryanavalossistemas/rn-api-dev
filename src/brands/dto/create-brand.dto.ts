import { MinLength } from 'class-validator';

export class CreateBrandDto {
  @MinLength(1)
  name: string;
}
