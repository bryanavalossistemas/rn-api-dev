import { Length } from 'class-validator';

export class VerifyEmailDto {
  @Length(6)
  token: string;
}
