import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePromotionDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly start_date!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly end_date!: string;

  @IsOptional()
  readonly note?: string;
}
