import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { PayPalService } from 'src/payments/services/paypal.service';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';

@Injectable()
export class PayPalStrategy implements PaymentStrategy {
  constructor(private readonly payPalService: PayPalService) {}

  async processPayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    console.log(createPaymentDto);
  }
}
