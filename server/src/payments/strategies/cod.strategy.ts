import { Injectable } from '@nestjs/common';
import { CreatePaymentData } from 'src/payments/dtos/create-payment.dto';
import { CodService } from 'src/payments/services/cod.service';
import { PaymentStrategy } from 'src/payments/strategies/payment.strategy';

@Injectable()
export class CodStrategy implements PaymentStrategy {
  constructor(private readonly codService: CodService) {}

  async processPayment(createPaymentData: CreatePaymentData): Promise<any> {
    return await this.codService.handlePayment(createPaymentData);
  }
}
