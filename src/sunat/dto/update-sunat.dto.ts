import { PartialType } from '@nestjs/mapped-types';
import { CreateSunatDto } from './create-sunat.dto';

export class UpdateSunatDto extends PartialType(CreateSunatDto) {}
