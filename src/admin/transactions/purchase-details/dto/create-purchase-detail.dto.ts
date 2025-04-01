import { IsInt, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreatePurchaseDetailDto {
  @IsInt({ message: 'El productId debe ser un número entero.' })
  @IsPositive({ message: 'El productId debe ser un número positivo.' })
  productId: number;

  @MinLength(1)
  productName: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo.' })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio unitario debe ser un número.' })
  @IsPositive({ message: 'El precio unitario debe ser un número positivo.' })
  unitPrice: number;
}
