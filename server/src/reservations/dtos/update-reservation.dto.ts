import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateReservationDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly date_time!: Date;

  @IsNumber()
  @IsPositive()
  readonly guests_count!: number;

  @IsOptional()
  readonly note?: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsString()
  @IsNotEmpty()
  readonly areaId!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  readonly tableIds!: string[];

  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['card', 'cash'])
  readonly payment_method!: string;
}
