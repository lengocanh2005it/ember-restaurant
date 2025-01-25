import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  readonly amount!: number;

  @IsString()
  @IsIn(['usd', 'euro'])
  readonly currency!: string;

  @IsNotEmpty()
  @IsIn(['cash', 'card', 'paypal', 'apple-pay'])
  readonly payment_method!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['order', 'reservation'])
  readonly type!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  @IsString()
  readonly payment_method_id?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  readonly orderId?: string;

  @IsOptional()
  readonly reservationId?: string;
}

export class CreatePaymentData extends CreatePaymentDto {
  readonly paymentId!: string;
}
