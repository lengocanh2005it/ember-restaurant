import { Exclude } from 'class-transformer';
import { Cart } from 'src/carts/entities/carts.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ nullable: true, unique: true })
  readonly username?: string;

  @Exclude()
  @Column({ nullable: true })
  readonly password?: string;

  @Column({ nullable: true, unique: true })
  readonly google_id?: string;

  @Column({ nullable: true, unique: true })
  readonly facebook_id?: string;

  @Column({ nullable: true })
  readonly name?: string;

  @Column({ nullable: true })
  readonly job?: string;

  @Column({ nullable: true, unique: true })
  readonly email?: string;

  @Column({ nullable: true })
  readonly phone?: string;

  @Column({ nullable: true })
  readonly address?: string;

  @Column({ type: 'enum', enum: ['dark', 'light'], default: 'dark' })
  readonly theme!: string;

  @Column({ default: 0 })
  readonly total_orders!: number;

  @Column({ default: 0 })
  readonly total_reservations!: number;

  @Column({ default: 0 })
  readonly loyalty_points!: number;

  @Column({
    default:
      'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735465375/default_user_logo_b1f7pd.png',
  })
  readonly image?: string;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  readonly roles?: Role[];

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  readonly carts?: Cart[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  readonly notifications?: Notification[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
  })
  readonly payments?: Payment[];

  @OneToMany(() => Reservation, (reservation) => reservation.user, {
    cascade: true,
  })
  readonly reservations?: Reservation[];

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  readonly orders?: Order[];

  @OneToMany(() => SupportTicket, (supportTicket) => supportTicket.user, {
    cascade: true,
  })
  readonly support_tickets?: SupportTicket[];

  @OneToMany(() => Review, (review) => review.user, {
    cascade: true,
  })
  readonly reviews?: Review[];

  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.user, {
    cascade: true,
  })
  readonly userDiscounts?: UserDiscount[];

  @OneToMany(() => TicketMessage, (ticket_message) => ticket_message.sender, {
    cascade: true,
  })
  readonly ticket_messages: TicketMessage[];
}
