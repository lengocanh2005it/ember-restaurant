import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly productId!: string;

  @IsNumber()
  @IsPositive()
  readonly quantity!: number;
}

export class CreateOrderProductDto {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  readonly order!: CreateOrderDto;

  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  readonly products!: CreateProductDto[];
}
