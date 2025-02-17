import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from 'src/notifications/dtos/create-notification.dto';
import { UpdateNotificationDto } from 'src/notifications/dtos/update-notification.dto';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { UserNotificationService } from 'src/user-notification/user-notification.service';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userNotificationService: UserNotificationService,
  ) {}

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      relations: ['user', 'userNotifications', 'userNotifications.user'],
    });

    return notifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((notification) => {
        const {
          id,
          image,
          title,
          createdAt,
          views,
          content,
          user,
          userNotifications,
        } = notification;

        return {
          id,
          image,
          title,
          date: createdAt.toISOString().split('T')[0],
          number: views,
          content,
          name: user?.name ? user.name : user.username,
          userNotifications: userNotifications.map((un) => {
            const { user } = un;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...res } = user;

            return {
              ...un,
              user: res,
            };
          }),
        };
      }) as any;
  }

  async findOne(id: string, user: User): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!notification) throw new NotFoundException('Notification Not Found.');

    const {
      image,
      title,
      createdAt,
      views,
      content,
      user: adminUser,
    } = notification;

    if (!user.roles.some((role) => role.name === 'admin')) {
      const { viewCount } =
        await this.userNotificationService.handleCreateOrUpdateUserNotificationRepository(
          user.id,
          id,
        );

      if (viewCount === 1) {
        await this.notificationRepository.update(
          {
            id,
          },
          {
            views: views + 1,
          },
        );
      }
    }

    return {
      id,
      image,
      title,
      date: createdAt.toISOString().split('T')[0],
      number: views,
      content,
      name: adminUser?.name ? adminUser.name : adminUser.username,
    } as any;
  }

  async createOne(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification[]> {
    const { userId } = createNotificationDto;

    const notification = this.notificationRepository.create(
      createNotificationDto,
    );

    await this.notificationRepository.save(notification);

    await this.notificationRepository
      .createQueryBuilder('notification')
      .relation(Notification, 'user')
      .of(notification.id)
      .set(userId);

    return await this.findAll();
  }

  async updateOne(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification[]> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) throw new NotFoundException('Notification Not Found.');

    await this.notificationRepository.update({ id }, updateNotificationDto);

    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Notification[]> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) throw new BadRequestException('Notification not found.');
    await this.notificationRepository.delete({ id });
    return await this.findAll();
  }
}
