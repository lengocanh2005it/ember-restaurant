import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProductService } from 'src/order-product/order-product.service';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentStrategy } from 'src/payments/payments.interface';
import { ProductsService } from 'src/products/products.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { CreateOrderData, CreateReservationData } from 'src/utils';
import Stripe from 'stripe';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly productsService: ProductsService,
    private readonly orderProductService: OrderProductService,
    private readonly discountsService: DiscountsService,
    private readonly userDiscountService: UserDiscountService,
    private readonly promotionsService: PromotionsService,
    private readonly tablesService: TablesService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async processPayment(
    type: string,
    amount: number,
    currency: string = 'usd',
    source: string,
    userId: string,
    orderId: string,
    reservationId: string,
    orderData?: CreateOrderData,
    reservationData?: CreateReservationData,
  ): Promise<Payment | void> {
    if (orderId || reservationId) {
      let order = null as Order;
      let reservation = null as Reservation;

      let amountOrder = 0;
      let amountReservation = 0;

      if (orderId) {
        order = await this.dataSource
          .getRepository(Order)
          .findOneBy({ id: orderId });

        if (!order) throw new NotFoundException('Order Not Found.');

        amountOrder = order.total_price;
      } else if (reservationId) {
        reservation = await this.dataSource
          .getRepository(Reservation)
          .findOneBy({ id: reservationId });

        if (!reservation) throw new NotFoundException('Reservation Not Found.');

        amountReservation = reservation.total_price;
      }

      if (amount < amountOrder || amount < amountReservation) {
        throw new BadRequestException(
          'The payment amount is less than the cost of the invoice.',
        );
      }

      const payment = await this.stripe.paymentIntents.create({
        amount: Math.max(
          +((amountOrder > 0 ? amountOrder : amountReservation) * 100).toFixed(
            2,
          ),
          0,
        ),
        currency,
        payment_method: source,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      await this.updatePayment(orderId, reservationId, payment);

      if (userId) {
        const user = await this.dataSource.getRepository(User).findOne({
          where: { id: userId },
        });

        if (!user) throw new NotFoundException('User Not Found.');

        const total_reservations = user.total_reservations;
        const total_orders = user.total_orders;
        const loyalty_points = user.loyalty_points;

        await this.dataSource
          .createQueryBuilder()
          .update(User)
          .set({
            ...(amountOrder > 0
              ? { total_orders: total_orders + 1 }
              : { total_reservations: total_reservations + 1 }),
            loyalty_points: loyalty_points + (amountOrder > 0 ? 10 : 15),
          })
          .where('id = :id', { id: userId })
          .execute();

        const newDiscount = await this.applyDiscount(
          amountOrder > 0 ? amountOrder : amountReservation,
          this.discountsService,
        );

        if (newDiscount) {
          await this.userDiscountService.addDiscountToUser(
            user,
            newDiscount as Discount,
          );
        }
      }

      return;
    } else {
      let price = 0;
      let order = null as Order;
      let reservation = null as Reservation;

      if (orderData && !orderData?.orderId) {
        const {
          delivery_method,
          delivery_address,
          note,
          discountId,
          total_price,
          promotionCode,
        } = orderData;

        price = total_price;

        if (amount < price)
          throw new BadRequestException(
            'The payment amount is less than the cost of the invoice.',
          );

        order = this.orderRepository.create({
          total_price,
          delivery_address,
          delivery_method,
          note,
          is_paid: true,
        });

        await this.orderRepository.save(order);

        if (promotionCode) {
          const discountFromPromotion =
            await this.promotionsService.checkPromotionCode(promotionCode);

          await this.orderRepository
            .createQueryBuilder('order')
            .relation(Order, 'discounts')
            .of(order.id)
            .add(discountFromPromotion.id);
        }

        if (discountId) {
          await this.userDiscountService.decreaseUserDiscountQuantity(
            userId,
            discountId,
          );

          await this.orderRepository
            .createQueryBuilder('order')
            .relation(Order, 'discounts')
            .of(order.id)
            .add(discountId);
        }

        const products =
          await this.productsService.transformProductAndQuantityToProducts(
            orderData.products,
          );

        await this.orderProductService.createOrderDetails(order, products);

        await this.orderRepository
          .createQueryBuilder('order')
          .relation(Order, 'user')
          .of(order.id)
          .set(userId);

        const user = await this.dataSource.getRepository(User).findOne({
          where: { id: userId },
          select: ['total_orders', 'loyalty_points', 'id'],
        });

        if (user) {
          const { total_orders, loyalty_points } = user;

          await this.dataSource
            .createQueryBuilder()
            .update(User)
            .set({
              total_orders: total_orders + 1,
              loyalty_points: loyalty_points + 10,
            })
            .where('id = :id', { id: userId })
            .execute();

          const newDiscount = await this.applyDiscount(
            price,
            this.discountsService,
          );

          if (newDiscount) {
            await this.userDiscountService.addDiscountToUser(
              user,
              newDiscount as Discount,
            );
          }
        } else throw new NotFoundException('User Not Found.');
      } else if (reservationData && !reservationData?.reservationId) {
        const {
          discountId,
          tableIds,
          guests_count,
          areaId,
          note,
          promotionCode,
          date_time,
        } = reservationData;

        const total_price =
          await this.tablesService.calculateTotalPrice(tableIds);

        price = total_price;

        reservation = this.reservationRepository.create({
          guests_count,
          note,
          status: 'pending',
          total_price,
          date_time,
          is_paid: true,
        });

        await this.reservationRepository.save(reservation);

        const user = await this.dataSource.getRepository(User).findOne({
          where: { id: userId },
          select: ['total_reservations', 'loyalty_points', 'id'],
        });

        if (!user) throw new NotFoundException('User Not Found.');

        if (user) {
          await this.reservationRepository
            .createQueryBuilder('reservation')
            .relation(Reservation, 'user')
            .of(reservation.id)
            .set(user.id);

          const { total_reservations, loyalty_points } = user;

          await this.dataSource
            .createQueryBuilder()
            .update(User)
            .set({
              total_reservations: total_reservations + 1,
              loyalty_points: loyalty_points + 15,
            })
            .where('id = :id', { id: userId })
            .execute();

          const newDiscount = await this.applyDiscount(
            price,
            this.discountsService,
          );

          if (newDiscount) {
            await this.userDiscountService.addDiscountToUser(
              user,
              newDiscount as Discount,
            );
          }
        }

        await this.tablesService.addTablesToReservation(
          tableIds,
          reservation.id,
          areaId,
          guests_count,
        );

        if (discountId) {
          await this.userDiscountService.decreaseUserDiscountQuantity(
            userId,
            discountId,
          );

          await this.reservationRepository
            .createQueryBuilder('reservation')
            .relation(Reservation, 'discounts')
            .of(reservation.id)
            .add(discountId);
        }

        if (promotionCode) {
          const discountFromPromotionCode =
            await this.promotionsService.checkPromotionCode(promotionCode);

          if (discountFromPromotionCode) {
            await this.reservationRepository
              .createQueryBuilder()
              .relation(Reservation, 'discounts')
              .of(reservation.id)
              .add(discountFromPromotionCode.id);
          }
        }
      }

      const payment = await this.stripe.paymentIntents.create({
        amount: Math.max(+(price * 100).toFixed(2), 0),
        currency,
        payment_method: source,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const { id, payment_method } = payment;

      const newPayment = this.paymentRepository.create({
        payment_intent_id: id,
        payment_method_id: payment_method as string,
        amount: payment.amount * 10,
        currency: payment.currency,
        status: 'success',
        payment_method: 'card',
        type,
      });

      await this.paymentRepository.save(newPayment);

      await this.paymentRepository
        .createQueryBuilder('payment')
        .relation(Payment, 'user')
        .of(newPayment.id)
        .set(userId);

      if ((orderData && orderData.orderId) || order) {
        await this.paymentRepository
          .createQueryBuilder('payment')
          .relation(Payment, 'order')
          .of(newPayment.id)
          .set(orderData.orderId ? orderData.orderId : order.id);
      } else if (
        (reservation && reservationData.reservationId) ||
        reservation
      ) {
        await this.paymentRepository
          .createQueryBuilder('payment')
          .relation(Payment, 'reservation')
          .of(newPayment.id)
          .set(
            reservationData.reservationId
              ? reservationData.reservationId
              : reservation.id,
          );
      }

      return newPayment;
    }
  }

  async getPayments(limit: number = 10): Promise<Stripe.PaymentIntent[]> {
    const paymentIntents = await this.stripe.paymentIntents.list({
      limit,
    });

    return paymentIntents.data;
  }

  async getPaymentIntentDetails(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) throw new NotFoundException('Payment not found!');
    return paymentIntent;
  }

  async getPaymentMethodDetails(
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (!paymentMethod)
      throw new NotFoundException('Payment Method not found!');
    return paymentMethod;
  }

  public updatePayment = async (
    orderId: string,
    reservationId: string,
    payment: Stripe.Response<Stripe.PaymentIntent>,
  ): Promise<void> => {
    let payment_id = '';

    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['payment'],
      });

      if (!order) throw new NotFoundException('Order Not Found.');

      await this.orderRepository.update(
        {
          id: orderId,
        },
        {
          is_paid: true,
        },
      );

      payment_id = order.payment.id;
    } else if (reservationId) {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['payment'],
      });

      if (!reservation) throw new NotFoundException('Reservation Not Found.');

      await this.reservationRepository.update(
        {
          id: reservationId,
        },
        {
          is_paid: true,
        },
      );

      payment_id = reservation.payment.id;
    }

    const findPayment = await this.paymentRepository.findOne({
      where: { id: payment_id },
    });

    if (!findPayment) throw new NotFoundException('Payment Not Found.');

    const { id, payment_method } = payment;

    await this.paymentRepository.update(
      {
        id: findPayment.id,
      },
      {
        payment_intent_id: id,
        payment_method_id: payment_method as string,
      },
    );
  };

  public applyDiscount = async (
    price: number,
    discountsService: DiscountsService,
  ): Promise<Discount | null> => {
    const discountLevels = [
      { threshold: 95, value: 15 },
      { threshold: 45, value: 10 },
      { threshold: 25, value: 5 },
    ];

    for (const level of discountLevels) {
      if (price > level.threshold) {
        return await discountsService.findDiscountByValueAndType(
          level.value,
          'usd',
        );
      }
    }

    return null;
  };
}
