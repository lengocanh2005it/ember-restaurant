import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { Payment } from 'src/payments/entities/payments.entity';
import { PaymentGateway } from 'src/payments/payment.gateway';
import { PaymentsModule } from 'src/payments/payments.module';
import { PaymentsService } from 'src/payments/payments.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { RolesModule } from 'src/roles/roles.module';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesModule } from 'src/tables/tables.module';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { TicketMessagesModule } from 'src/ticket_messages/ticket_messages.module';
import { TicketMessagesService } from 'src/ticket_messages/ticket_messages.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { User } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { SupportTicketController } from './support-ticket.controller';
import { SupportTicketService } from './support-ticket.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportTicket,
      User,
      UserDiscount,
      Reservation,
      Payment,
      Table,
      Order,
      Product,
      OrderProduct,
      Promotion,
      TicketMessage,
    ]),
    UsersModule,
    RolesModule,
    PermissionsModule,
    DiscountsModule,
    OrdersModule,
    UserDiscountModule,
    ReservationsModule,
    TablesModule,
    PaymentsModule,
    OrdersModule,
    ProductsModule,
    OrderProductModule,
    PromotionsModule,
    TicketMessagesModule,
  ],
  providers: [
    UsersService,
    SupportTicketService,
    UserDiscountService,
    ReservationsService,
    PaymentsService,
    TicketMessagesService,
    PaymentGateway,
    JwtService,
    AuthService,
  ],
  controllers: [SupportTicketController],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
