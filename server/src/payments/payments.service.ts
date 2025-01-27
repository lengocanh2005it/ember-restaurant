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
import { PaymentGateway } from 'src/payments/payment.gateway';
import { StripeService } from 'src/payments/services/stripe.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { User } from 'src/users/entities/users.entity';
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
    private readonly paymentGateway: PaymentGateway,
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

          this.paymentGateway.sendPaymentStatusUpdate(
            'payment_intent.created',
            orderId,
          );

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

          this.paymentGateway.sendPaymentStatusUpdate(
            'payment_intent.created',
            null,
            reservationId,
          );
        }
      }
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const { metadata } = paymentIntent;

        const { userId } = metadata;

        const user = await this.dataSource
          .getRepository(User)
          .findOneBy({ id: userId });

        if (!user) throw new NotFoundException('User Not Found.');

        const total_orders = user.total_orders;
        const total_reservations = user.total_reservations;
        const loyalty_points = user.loyalty_points;

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

          await this.dataSource.getRepository(User).update(
            { id: userId },
            {
              total_orders: total_orders + 1,
              loyalty_points: loyalty_points + 10,
            },
          );

          this.paymentGateway.sendPaymentStatusUpdate(
            'payment_intent.succeeded',
            orderId,
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

          await this.dataSource.getRepository(User).update(
            { id: userId },
            {
              total_reservations: total_reservations + 1,
              loyalty_points: loyalty_points + 15,
            },
          );

          this.paymentGateway.sendPaymentStatusUpdate(
            'payment_intent.succeeded',
            null,
            reservationId,
          );
        }
        break;
      case 'payment_intent.payment_failed':
        const paymentFailedIntent = event.data.object as Stripe.PaymentIntent;

        this.paymentGateway.sendPaymentStatusUpdate(
          'payment_intent.payment_failed',
        );

        throw new BadRequestException(
          `PaymentIntent failed: ${paymentFailedIntent}`,
        );
      default:
        throw new BadRequestException(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  };
}
