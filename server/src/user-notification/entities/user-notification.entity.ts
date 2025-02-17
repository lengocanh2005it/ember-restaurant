import { Notification } from 'src/notifications/entities/notifications.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user-notification' })
export class UserNotification {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'timestamp', nullable: true })
  readonly viewed_at?: Date;

  @Column({ type: 'int' })
  readonly view_count!: number;

  @ManyToOne(() => User, (user) => user.userNotifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToOne(
    () => Notification,
    (notification) => notification.userNotifications,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'notification_id' })
  readonly notification!: Notification;
}
