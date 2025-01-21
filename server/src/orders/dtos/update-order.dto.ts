import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class Product {
  @IsBoolean()
  @IsNotEmpty()
  readonly is_available!: boolean;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  @IsPositive()
  readonly quantity!: number;

  @IsNumber()
  @IsPositive()
  readonly price!: number;
}

export class UpdateOrderDto {
  @IsNumber()
  @IsPositive()
  readonly total_price!: number;

  @IsOptional()
  readonly delivery_address?: string;

  @IsIn(['home_delivery', 'pick_up'])
  @IsNotEmpty()
  readonly delivery_method!: string;

  @IsString()
  @IsNotEmpty()
  readonly payment_method!: string;

  @IsOptional()
  readonly note?: string;

  @Type(() => Product)
  @IsArray()
  readonly products!: Product[];

  @IsOptional()
  readonly discountId?: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  readonly status?: string;

  @IsOptional()
  readonly promotionCode?: string;

  @IsOptional()
  readonly admin_message?: string;
}
