import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateAreaDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly capacity!: number;

  @IsNumber()
  @IsPositive()
  readonly floor_number!: number;

  @IsString()
  @IsIn(['running', 'maintenance'])
  @IsNotEmpty()
  readonly status!: string;

  @IsString()
  @IsNotEmpty()
  readonly operating_hours!: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly is_full!: boolean;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  readonly tableIds!: string[];
}
