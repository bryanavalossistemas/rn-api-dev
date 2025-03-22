import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CreateSupplierDto } from './create-supplier.dto';

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments) {
    const type = (args.object as CreateSupplierDto).type;
    if (type === 'RUC' && document.length === 11) {
      return true;
    }
    if (type === 'DNI' && document.length === 8) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const type = (args.object as CreateSupplierDto).type;
    if (type === 'RUC') {
      return 'El RUC debe tener 11 dígitos';
    } else if (type === 'DNI') {
      return 'El DNI debe tener 8 dígitos';
    }
    return 'Tipo de documento no válido';
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidDocumentConstraint,
    });
  };
}
