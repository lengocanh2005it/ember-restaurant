import { Discount } from 'src/discounts/entities/discounts.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Table } from 'src/tables/entities/tables.entity';
import { User } from 'src/users/entities/users.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reservation' })
export class Reservation {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  generateOrderId() {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    this.id = `RES${randomString}`;
  }

  @Column({ type: 'timestamp' })
  readonly date_time!: Date;

  @Column({ type: 'boolean', default: false })
  readonly is_paid!: boolean;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status!: string;

  @Column({ type: 'int' })
  readonly guests_count!: number;

  @Column({ nullable: true })
  readonly note?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly total_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly discount_price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly original_price!: number;

  @Column({ nullable: true })
  readonly admin_message?: string;

  @OneToOne(() => Payment, (payment) => payment.reservation, {
    cascade: true,
  })
  @JoinColumn({ name: 'payment_id' })
  readonly payment?: Payment;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToMany(() => Review, (review) => review.reservations, {
    cascade: true,
    nullable: true,
  })
  readonly reviews?: Review[];

  @ManyToMany(() => Discount, (discount) => discount.reservations, {
    nullable: true,
  })
  readonly discounts?: Discount[];

  @ManyToMany(() => Table, (table) => table.reservations, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'reservation_table',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'table_id',
      referencedColumnName: 'id',
    },
  })
  readonly tables!: Table[];

  @DeleteDateColumn({ type: 'timestamp' })
  readonly deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
