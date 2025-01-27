import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreatePaymentData } from 'src/payments/dtos/create-payment.dto';
import { StripeService } from 'src/payments/services/stripe.service';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';
import { User } from 'src/users/entities/users.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  constructor(
    private readonly stripeService: StripeService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async processPayment(createPaymentData: CreatePaymentData): Promise<any> {
    const {
      amount,
      currency,
      payment_method_id,
      userId,
      reservationId,
      orderId,
      description,
      paymentId,
    } = createPaymentData;

    try {
      const user = await this.dataSource
        .getRepository(User)
        .findOneBy({ id: userId });

      if (!user) throw new NotFoundException('User Not Found.');

      await this.stripeService.createStripeIntent({
        amount: Math.round(amount * 100),
        currency,
        payment_method: payment_method_id,
        metadata: {
          ...(orderId && { orderId }),
          ...(reservationId && { reservationId }),
          type: orderId ? 'order' : 'reservation',
          paymentId,
          userId,
        },
        description,
        user,
      });
    } catch (error) {
      console.error('Stripe payment error:', error.message);
      throw new Error('Payment via Stripe failed');
    }
  }
}
