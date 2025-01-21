import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsNumber()
  @IsPositive()
  readonly price!: number;

  @IsNumber()
  @IsPositive()
  readonly stock!: number;

  @IsOptional()
  readonly is_featured?: boolean;

  @IsOptional()
  readonly is_available?: boolean;
}
