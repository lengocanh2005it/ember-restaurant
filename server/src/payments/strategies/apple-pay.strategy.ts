import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';

@Injectable()
export class ApplePayStrategy implements PaymentStrategy {
  constructor(private readonly applePayService: ApplePayService) {}

  async processPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    console.log(createPaymentDto);
  }
}
