import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Order } from 'src/orders/entities/orders.entity';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentContext } from 'src/payments/payment.context';
import { StripeService } from 'src/payments/services/stripe.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { getEnvValue } from 'src/utils';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly discountsService: DiscountsService,
    private readonly paymentContext: PaymentContext,
    private readonly stripeService: StripeService,
  ) {}

  public createPayment = async (
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> => {
    const { amount, userId, type, payment_method, currency, description } =
      createPaymentDto;

    const payment = this.paymentRepository.create({
      amount,
      currency,
      payment_method,
      type,
      description,
    });

    await this.paymentRepository.save(payment);

    await this.dataSource
      .createQueryBuilder()
      .relation(Payment, 'user')
      .of(payment.id)
      .set(userId);

    this.paymentContext.setStrategy(payment_method);

    await this.paymentContext.executePayment({
      ...createPaymentDto,
      paymentId: payment.id,
    });

    return payment;
  };

  public updatePaymentMethod = async (
    paymentId: string,
    payment_method: string,
    amount?: number,
  ): Promise<void> => {
    const findPayment = await this.paymentRepository.findOneBy({
      id: paymentId,
    });

    if (!findPayment) throw new NotFoundException('Payment Not Found.');

    await this.paymentRepository.update(
      { id: paymentId },
      {
        payment_method,
      },
    );

    if (amount) {
      await this.paymentRepository.update(
        {
          id: paymentId,
        },
        {
          amount,
        },
      );
    }
  };

  public handleStripeWebhook = async (
    headers: Record<string, string>,
    payload: any,
  ) => {
    const endpointSecret = getEnvValue(
      'STRIPE_WEBHOOK_SECRET_PROD',
      'STRIPE_WEBHOOK_SECRET_DEV',
    );

    const sig = headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = this.stripeService.checkValidWebhooks(
        payload,
        sig,
        endpointSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.created': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { metadata } = paymentIntent;

        if (
          metadata &&
          metadata.orderId &&
          metadata.type === 'order' &&
          metadata.paymentId
        ) {
          const { orderId, paymentId } = metadata;

          await this.dataSource
            .createQueryBuilder()
            .relation(Order, 'payment')
            .of(orderId)
            .set(paymentId);
        } else if (
          metadata &&
          metadata.reservationId &&
          metadata.type === 'reservation' &&
          metadata.paymentId
        ) {
          const { reservationId, paymentId } = metadata;

          await this.dataSource
            .createQueryBuilder()
            .relation(Reservation, 'payment')
            .of(reservationId)
            .set(paymentId);
        }
      }
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { metadata } = paymentIntent;

        if (
          metadata &&
          metadata.orderId &&
          metadata.type === 'order' &&
          metadata.paymentId &&
          paymentIntent?.payment_method
        ) {
          const { orderId } = metadata;

          const order = await this.dataSource
            .getRepository(Order)
            .findOneBy({ id: orderId });

          if (!order) throw new NotFoundException('Order Not Found.');

          await this.dataSource.getRepository(Order).update(
            { id: orderId },
            {
              is_paid: true,
            },
          );
        } else if (
          metadata &&
          metadata.reservationId &&
          metadata.type === 'reservation' &&
          metadata.paymentId &&
          paymentIntent?.payment_method
        ) {
          const { reservationId } = metadata;

          const reservationRepository =
            this.dataSource.getRepository(Reservation);

          const order = await reservationRepository.findOneBy({
            id: reservationId,
          });

          if (!order) throw new NotFoundException('Reservation Not Found.');

          await reservationRepository.update(
            { id: reservationId },
            {
              is_paid: true,
            },
          );
        }
        break;
      case 'payment_intent.payment_failed':
        const paymentFailedIntent = event.data.object as Stripe.PaymentIntent;

        throw new BadRequestException(
          `PaymentIntent failed: ${paymentFailedIntent}`,
        );
      default:
        throw new BadRequestException(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  };
}
