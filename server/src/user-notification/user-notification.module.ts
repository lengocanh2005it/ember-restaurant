import { Module } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from 'src/user-notification/entities/user-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotification])],
  providers: [UserNotificationService],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
