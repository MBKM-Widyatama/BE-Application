import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'IsExists', async: true })
@Injectable()
export class IsExistsConstraint implements ValidatorConstraintInterface {
  isDeleted = false;

  constructor(private dataSource: DataSource) {}

  // check in the "model" table for a "model" with "property" value entered, if it is already taken, it will check if it is taken by the same current "model", and if so, no issues with validation, otherwise, validation fails.
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, property = 'id', exceptField = null] = args.constraints;
    if (!value || !model) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const columns = property.split(',');
    const condition = [];
    const values = [];
    columns.forEach((col, index) => {
      condition.push(`${col}::text ilike $${index + 1}`);

      const keyObj = col
        .toLowerCase()
        .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
      values.push(args.object[keyObj]);
    });

    const record = await queryRunner.manager.query(
      `select * from ${model} where ${condition.join(' AND ')}`,
      values,
    );

    await queryRunner.release();

    // value is not exists return as valid
    if (!record[0]) return true;

    if (record[0].deleted_at) {
      this.isDeleted = true;
    }

    // resturn as invalid if exceptField is not set after record exists
    if (!exceptField) return false;

    let exceptFieldValue;
    if (args.object['context']) {
      exceptFieldValue = args.object['context'].params[exceptField];
    } else {
      exceptFieldValue = (args.object as any)[exceptField];
    }

    // resturn as invalid if exceptFieldValue is not found
    if (!exceptFieldValue) return false;

    // resturn as valid if value exceptField on record == exceptFieldValue
    return record[0][exceptField] === exceptFieldValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    if (this.isDeleted) {
      return `$property $value is exists and deleted. use another data or contact administrator.`;
    }

    return `$property $value is exists. please use another name.`;
  }
}

export function IsExists(
  model: string,
  uniqueField: string,
  exceptField: string = null,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField, exceptField],
      validator: IsExistsConstraint,
    });
  };
}
