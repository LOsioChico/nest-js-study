import {
  IsEmail,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUniqueEmail', async: true })
export default class IsUniqueEmail implements ValidatorConstraintInterface {
  async validate(value: string): Promise<boolean> {
    return isUniqueEmail(value);
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} is already used`;
  }
}

async function isUniqueEmail(email: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(!dataSource.includes(email));
    }, 1000); // This is a mock delay for testing
  });
}

export const dataSource = [
  'john@example.com',
  'jane@example.com',
  'jim@example.com',
  'jill@example.com',
  'jack@example.com',
]; // This is a mock data source for testing, in production it should be a database query

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Validate(IsUniqueEmail)
  email: string;
}
