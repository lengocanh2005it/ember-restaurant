import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Payment } from 'src/payments/entities/payments.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { User } from 'src/users/entities/users.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  generateOrderId() {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    this.id = `ORD${randomString}`;
  }

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  readonly total_price!: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status?: string;

  @Column({ nullable: true })
  readonly delivery_address?: string;

  @Column({ type: 'boolean', default: false })
  readonly is_paid!: boolean;

  @Column({ type: 'enum', enum: ['home_delivery', 'pick_up'] })
  readonly delivery_method!: string;

  @Column({ nullable: true })
  readonly note?: string;

  @Column({ nullable: true })
  readonly admin_message?: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  readonly order_details!: OrderProduct[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'payment_id' })
  readonly payment?: Payment;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @ManyToMany(() => Review, (review) => review.orders, {
    onDelete: 'CASCADE',
  })
  readonly reviews?: Review[];

  @ManyToMany(() => Discount, (discount) => discount.orders, { nullable: true })
  readonly discounts?: Discount[];

  @DeleteDateColumn({ type: 'timestamp' })
  readonly deletedAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
