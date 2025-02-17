import { Module } from '@nestjs/common';
import { TicketMessagesService } from './ticket_messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { TicketMessagesController } from 'src/ticket_messages/ticket_messages.controller';
import { SupportTicketService } from 'src/support_ticket/support-ticket.service';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketMessage, SupportTicket])],
  providers: [TicketMessagesService, SupportTicketService],
  controllers: [TicketMessagesController],
  exports: [TicketMessagesService],
})
export class TicketMessagesModule {}
