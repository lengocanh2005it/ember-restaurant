import { Order } from 'src/orders/entities/orders.entity';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
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

@Entity({ name: 'discount' })
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'] })
  readonly type!: string;

  @Column({ type: 'int' })
  readonly value!: number;

  @Column({ nullable: true })
  readonly description?: string;

  @Column({ type: 'timestamp' })
  readonly start_date!: Date;

  @Column({ type: 'timestamp' })
  readonly end_date!: Date;

  @Column({ type: 'boolean' })
  readonly is_active!: boolean;

  @Column({ type: 'enum', enum: ['vnd', 'usd'], default: 'usd' })
  readonly currency!: string;

  @OneToMany(() => UserDiscount, (userDiscount) => userDiscount.discount, {
    cascade: true,
  })
  readonly userDiscounts!: UserDiscount[];

  @ManyToMany(() => Order, (order) => order.discounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'order_discount',
    joinColumn: {
      name: 'discount_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
  })
  readonly orders?: Order[];

  @ManyToMany(() => Reservation, (reservation) => reservation.discounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'reservation_discount',
    joinColumn: {
      name: 'discount_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
  })
  readonly reservations?: Reservation[];

  @OneToMany(() => Promotion, (promotion) => promotion.discount, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  readonly promotions?: Promotion[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
