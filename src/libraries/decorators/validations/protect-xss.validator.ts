import {
  ValidatorConstraint,
  registerDecorator,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsProtectXSSAttacks(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ProtectXSSAttacks,
    });
  };
}

@ValidatorConstraint({ name: 'ProtectXSSAttacks' })
export class ProtectXSSAttacks implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const regex = /<script[\s\S]*?<\/script>|<[^>]*>/gi;
    return !text.match(regex);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Input contains HTML or Javascript tag';
  }
}
