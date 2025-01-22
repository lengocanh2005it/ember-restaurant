import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';

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

  @IsArray()
  @ArrayNotEmpty()
  readonly order_details!: OrderProduct[];

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
