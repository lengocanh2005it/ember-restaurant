import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { OrdersModule } from 'src/orders/orders.module';
import { Order } from 'src/orders/entities/orders.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesModule } from 'src/roles/roles.module';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { UserDiscountModule } from 'src/user-discount/user-discount.module';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { Reservation } from 'src/reservations/entities/reservations.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      User,
      Order,
      Role,
      Discount,
      UserDiscount,
      Reservation,
    ]),
    UsersModule,
    OrdersModule,
    RolesModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, UsersService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
