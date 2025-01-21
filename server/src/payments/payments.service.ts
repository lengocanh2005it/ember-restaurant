import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountsService } from 'src/discounts/discounts.service';
import { CreatePaymentDto } from 'src/payments/dtos/create-payment.dto';
import { Payment } from 'src/payments/entities/payments.entity';
import { StripeStrategy } from 'src/payments/strategies/stripe.strategy';
import { User } from 'src/users/entities/users.entity';
import { CreateOrderData, CreateReservationData } from 'src/utils';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly stripeStrategy: StripeStrategy,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
    private readonly discountsService: DiscountsService,
  ) {}

  public handlePaymentByCard = async (
    createPaymentDto: CreatePaymentDto,
    orderData?: CreateOrderData,
    reservationData?: CreateReservationData,
  ): Promise<Payment | void> => {
    const { userId, amount, source, type, orderId, reservationId } =
      createPaymentDto;

    return this.stripeStrategy.processPayment(
      type,
      amount,
      'usd',
      source,
      userId,
      orderId,
      reservationId,
      orderData,
      reservationData,
    );
  };

  public getPayments = async (): Promise<any> => {
    return await this.stripeStrategy.getPayments();
  };

  public getPaymentIntentDetails = async (
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> => {
    return await this.stripeStrategy.getPaymentIntentDetails(paymentIntentId);
  };

  public getPaymentMethodDetails = async (
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> => {
    return await this.stripeStrategy.getPaymentMethodDetails(paymentMethodId);
  };

  public createPayment = async (
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> => {
    const { amount, userId, type, payment_method } = createPaymentDto;

    const payment = this.paymentRepository.create({
      amount,
      currency: 'usd',
      payment_method,
      type,
    });

    await this.paymentRepository.save(payment);

    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    await this.dataSource
      .createQueryBuilder()
      .update(Payment)
      .set({
        user,
      })
      .where('id = :id', { id: payment.id })
      .execute();

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
}
