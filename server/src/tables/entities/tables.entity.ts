import { Area } from 'src/areas/entities/areas.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'table' })
export class Table {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly name!: string;

  @Column({ nullable: true })
  readonly note?: string;

  @Column({ type: 'int' })
  readonly capacity!: number;

  @Column({
    type: 'enum',
    enum: ['running', 'maintenance'],
    default: 'running',
  })
  readonly status!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  readonly is_reserved!: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  readonly price!: number;

  @Column({
    type: 'enum',
    enum: ['normal', 'vip'],
  })
  readonly type!: string;

  @ManyToOne(() => Area, (area) => area.tables, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'area_id' })
  readonly area?: Area;

  @ManyToMany(() => Reservation, (reservation) => reservation.tables)
  readonly reservations!: Reservation[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
