import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from 'src/notifications/dtos/create-notification.dto';
import { UpdateNotificationDto } from 'src/notifications/dtos/update-notification.dto';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      relations: ['user'],
    });

    return notifications.map((notification) => {
      const { id, image, title, createdAt, views, content, user } =
        notification;
      return {
        id,
        image,
        title,
        date: createdAt.toISOString().split('T')[0],
        number: views,
        content,
        name: user?.name ? user.name : user.username,
      };
    }) as any;
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!notification) throw new NotFoundException('Notification Not Found.');

    const { image, title, createdAt, views, content, user } = notification;

    return {
      id,
      image,
      title,
      date: createdAt.toISOString().split('T')[0],
      number: views,
      content,
      name: user?.name ? user.name : user.username,
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
