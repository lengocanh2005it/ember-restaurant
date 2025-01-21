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
  readonly source?: string;

  @IsNotEmpty()
  @IsIn(['cash', 'card'])
  readonly payment_method!: string;

  @IsNotEmpty()
  @IsIn(['order', 'reservation'])
  readonly type!: string;

  @IsOptional()
  readonly discountId?: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  readonly orderId?: string;

  @IsOptional()
  readonly reservationId?: string;
}
