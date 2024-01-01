import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDro {
  @Length(5)
  @IsString()
  username: string;

  @Length(6)
  @IsString()
  password: string;

  @Length(6)
  @IsString()
  confirmPassword: string;

  @Length(2)
  @IsString()
  firstName: string;

  @Length(5)
  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;
}
