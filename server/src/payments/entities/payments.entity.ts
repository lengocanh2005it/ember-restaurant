import { Order } from 'src/orders/entities/orders.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ nullable: true })
  readonly payment_intent_id?: string;

  @Column({ nullable: true })
  readonly payment_method_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly amount!: number;

  @Column({ type: 'enum', enum: ['cash', 'card'] })
  readonly payment_method!: string;

  @Column({ type: 'enum', enum: ['order', 'reservation'] })
  readonly type!: string;

  @Column({ type: 'enum', enum: ['usd', 'vnd'], default: 'usd' })
  readonly currency?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status?: string;

  @Column({ nullable: true })
  readonly description?: string;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @OneToOne(() => Order, (order) => order.payment, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  readonly order?: Order;

  @OneToOne(() => Reservation, (reservation) => reservation.payment, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  readonly reservation?: Reservation;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
