import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { ReservationsService } from 'src/reservations/reservations.service';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { TablesModule } from 'src/tables/tables.module';
import { Table } from 'src/tables/entities/tables.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { Payment } from 'src/payments/entities/payments.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/products.entity';
import { ProductsModule } from 'src/products/products.module';
import { OrderProductModule } from 'src/order-product/order-product.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { TicketMessagesModule } from 'src/ticket_messages/ticket_messages.module';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { TicketMessagesService } from 'src/ticket_messages/ticket_messages.service';

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
  ],
  controllers: [SupportTicketController],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
