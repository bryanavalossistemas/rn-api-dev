import { Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @Length(6)
  token: string;

  @MinLength(8)
  password: string;
}
