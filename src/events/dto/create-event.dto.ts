import { IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 200, { message: 'name must have more than 4 character' })
  name: string;

  @IsString()
  description: string;

  @IsString()
  when: string;

  @IsString()
  address: string;
}
