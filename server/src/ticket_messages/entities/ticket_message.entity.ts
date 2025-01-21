import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ticket_message' })
export class TicketMessage {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  readonly message!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'] })
  readonly sender_type!: string;

  @ManyToOne(
    () => SupportTicket,
    (supportTicket) => supportTicket.ticket_messages,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'support_ticket_id' })
  readonly support_ticket!: SupportTicket;

  @ManyToOne(() => User, (user) => user.ticket_messages, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sender_id' })
  readonly sender!: User;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;
}
