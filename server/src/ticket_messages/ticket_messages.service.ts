import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketMessageDto } from 'src/ticket_messages/dtos/create-ticket_message.dto';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketMessagesService {
  constructor(
    @InjectRepository(TicketMessage)
    private readonly ticketMessageRepository: Repository<TicketMessage>,
  ) {}

  public createTicketMessage = async (
    createTicketMessageDto: CreateTicketMessageDto,
  ): Promise<void> => {
    const { senderId, supportTicketId, ...res } = createTicketMessageDto;

    const newTicketMessage = this.ticketMessageRepository.create(res);

    await this.ticketMessageRepository.save(newTicketMessage);

    if (senderId && supportTicketId) {
      await this.ticketMessageRepository
        .createQueryBuilder('ticket_message')
        .relation(TicketMessage, 'sender')
        .of(newTicketMessage.id)
        .set(senderId);

      await this.ticketMessageRepository
        .createQueryBuilder('ticket_message')
        .relation(TicketMessage, 'support_ticket')
        .of(newTicketMessage.id)
        .set(supportTicketId);
    }
  };
}
