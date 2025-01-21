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

export class CreateReservationDto {
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

  @IsString()
  @IsIn(['cash', 'card'])
  @IsNotEmpty()
  readonly payment_method!: string;

  @IsOptional()
  readonly is_paid?: boolean;

  @IsOptional()
  readonly discountId?: string;
}
