import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApplePayService } from 'src/payments/services/apple-pay.service';
import { CodService } from 'src/payments/services/cod.service';
import { PayPalService } from 'src/payments/services/paypal.service';
import { StripeService } from 'src/payments/services/stripe.service';
import { ApplePayStrategy } from 'src/payments/strategies/apple-pay.strategy';
import { CodStrategy } from 'src/payments/strategies/cod.strategy';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';
import { PayPalStrategy } from 'src/payments/strategies/paypal.strategy';
import { StripeStrategy } from 'src/payments/strategies/stripe.strategy';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentStrategyFactory {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly stripeService: StripeService,
    private readonly paypalService: PayPalService,
    private readonly applePayService: ApplePayService,
    private readonly codService: CodService,
  ) {}

  createPaymentStrategy(paymentMethod: string): PaymentStrategy {
    switch (paymentMethod) {
      case 'card': {
        return new StripeStrategy(this.stripeService, this.dataSource);
      }
      case 'paypal': {
        return new PayPalStrategy(this.paypalService);
      }
      case 'apple-pay': {
        return new ApplePayStrategy(this.applePayService);
      }
      case 'cash': {
        return new CodStrategy(this.codService);
      }
      default:
        throw new BadRequestException('Unknown Payment Method');
    }
  }
}
