import { UserNotification } from 'src/user-notification/entities/user-notification.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly title!: string;

  @Column()
  readonly content!: string;

  @Column({ type: 'int', default: 1 })
  readonly views?: number;

  @Column()
  readonly image!: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  readonly user!: User;

  @OneToMany(
    () => UserNotification,
    (userNotification) => userNotification.notification,
    {
      cascade: true,
    },
  )
  readonly userNotifications!: UserNotification[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
