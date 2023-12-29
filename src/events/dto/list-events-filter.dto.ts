import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export enum WhenEventFilterEnum {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}

export class WhenEventFilterDto {
  @IsOptional()
  @IsNumber()
  when?: WhenEventFilterEnum = WhenEventFilterEnum.All;

  @IsNumber()
  @Type(() => Number)
  page: number;

  @Type(() => Number)
  @IsNumber()
  limit: number;
}
