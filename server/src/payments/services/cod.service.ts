import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/orders.entity';
import { CreatePaymentData } from 'src/payments/dtos/create-payment.dto';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CodService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public handlePayment = async (
    createPaymentData: CreatePaymentData,
  ): Promise<any> => {
    const { paymentId, orderId, reservationId } = createPaymentData;

    await this.dataSource
      .createQueryBuilder()
      .relation(orderId ? Order : Reservation, 'payment')
      .of(orderId ? orderId : reservationId)
      .set(paymentId);
  };
}
