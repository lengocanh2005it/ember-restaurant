import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
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

@Entity({ name: 'support_ticket' })
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly original_request!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  })
  readonly status?: string;

  @OneToMany(
    () => TicketMessage,
    (ticket_message) => ticket_message.support_ticket,
    {
      cascade: true,
    },
  )
  readonly ticket_messages: TicketMessage[];

  @ManyToOne(() => User, (user) => user.support_tickets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  readonly user: User;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
