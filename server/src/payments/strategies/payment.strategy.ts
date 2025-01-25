import { CreatePaymentData } from 'src/payments/dtos/create-payment.dto';

export interface PaymentStrategy {
  processPayment(createPaymentData: CreatePaymentData): Promise<any>;
}
