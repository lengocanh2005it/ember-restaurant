import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from 'src/user-notification/entities/user-notification.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserNotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public handleCreateOrUpdateUserNotificationRepository = async (
    userId: string,
    notificationId: string,
  ): Promise<any> => {
    const userNotification = await this.userNotificationRepository.findOne({
      where: {
        user: { id: userId },
        notification: { id: notificationId },
      },
      relations: ['user', 'notification'],
    });

    if (!userNotification) {
      const newUserNotification = this.userNotificationRepository.create({
        viewed_at: new Date(),
        view_count: 1,
      });

      await this.userNotificationRepository.save(newUserNotification);

      await this.dataSource
        .createQueryBuilder()
        .relation(UserNotification, 'user')
        .of(newUserNotification.id)
        .set(userId);

      await this.dataSource
        .createQueryBuilder()
        .relation(UserNotification, 'notification')
        .of(newUserNotification.id)
        .set(notificationId);

      return {
        viewCount: 1,
      };
    } else {
      const viewCount = userNotification.view_count;

      await this.userNotificationRepository.update(
        {
          user: { id: userId },
          notification: { id: notificationId },
        },
        {
          view_count: viewCount + 1,
          viewed_at: new Date(),
        },
      );

      return {
        viewCount: viewCount + 1,
      };
    }
  };
}
