import { Module } from '@nestjs/common';
import { TicketMessagesService } from './ticket_messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketMessage])],
  providers: [TicketMessagesService],
  exports: [TicketMessagesService],
})
export class TicketMessagesModule {}
