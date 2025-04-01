import { CreateCustomerDto } from '@/admin/transactions/customers/dto/create-customer.dto';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(documentNumber: string, args: ValidationArguments) {
    const documentType = (args.object as CreateCustomerDto).documentType;
    if (documentType === 'RUC' && documentNumber.length === 11) {
      return true;
    }
    if (documentType === 'DNI' && documentNumber.length === 8) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const documentType = (args.object as CreateCustomerDto).documentType;
    if (documentType === 'RUC') {
      return 'El RUC debe tener 11 dígitos';
    } else if (documentType === 'DNI') {
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
