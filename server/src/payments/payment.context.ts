import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentData } from 'src/payments/dtos/create-payment.dto';
import { PaymentStrategyFactory } from 'src/payments/payment.factory';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';

@Injectable()
export class PaymentContext {
  private strategy: PaymentStrategy;

  constructor(
    private readonly paymentStrategyFactory: PaymentStrategyFactory,
  ) {}

  setStrategy(paymentMethod: string) {
    this.strategy =
      this.paymentStrategyFactory.createPaymentStrategy(paymentMethod);
  }

  async executePayment(createPaymentData: CreatePaymentData) {
    if (!this.strategy) throw new BadRequestException('Unknown Strategy!');
    return await this.strategy.processPayment(createPaymentData);
  }
}
