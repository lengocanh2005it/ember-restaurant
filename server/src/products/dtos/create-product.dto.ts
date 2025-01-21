import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
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

  @IsString()
  @IsNotEmpty()
  readonly image!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'appetizer',
    'dessert',
    'hotpot',
    'main_course',
    'beverage',
    'signature_dishes',
    'snack',
  ])
  readonly category!: string;

  @IsNotEmpty()
  @IsString()
  readonly ingredients!: string;

  @IsOptional()
  readonly is_featured?: boolean;
}
