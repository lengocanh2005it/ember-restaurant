import { Payment } from 'src/payments/entities/payments.entity';
import { CreateOrderData, CreateReservationData } from 'src/utils';

export interface DiscountStrategy {
  applyDiscount(amount: number): number;
}

export interface PaymentStrategy {
  processPayment(
    type: string,
    amount: number,
    currency: string,
    source: string,
    userId: string,
    orderId: string,
    reservationId: string,
    orderData?: CreateOrderData,
    reservationData?: CreateReservationData,
  ): Promise<Payment | void>;
}
