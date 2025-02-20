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
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserNotificationModule } from 'src/user-notification/user-notification.module';
import { UserNotification } from 'src/user-notification/entities/user-notification.entity';
import { Email } from 'src/emails/entities/emails.entity';
import { EmailsService } from 'src/emails/emails.service';
import { UploadsService } from 'src/uploads/uploads.service';

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
      UserNotification,
      Email,
    ]),
    UsersModule,
    OrdersModule,
    RolesModule,
    DiscountsModule,
    UserDiscountModule,
    ReservationsModule,
    UserNotificationModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    UsersService,
    AuthService,
    JwtService,
    EmailsService,
    UploadsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
