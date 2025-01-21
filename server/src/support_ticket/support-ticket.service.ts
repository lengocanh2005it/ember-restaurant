import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateSupportTicketDto } from 'src/support_ticket/dtos/create-support-ticket.dto';
import { UpdateSupportTicketDto } from 'src/support_ticket/dtos/update-support-ticket.dto';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { TicketMessagesService } from 'src/ticket_messages/ticket_messages.service';
import { User } from 'src/users/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly ticketMessagesService: TicketMessagesService,
  ) {}

  async getAll(): Promise<any> {
    const supportTickets = await this.supportTicketRepository.find({
      relations: [
        'user',
        'ticket_messages',
        'ticket_messages.sender',
        'ticket_messages.support_ticket',
      ],
    });

    return supportTickets.map((sp) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, ...res } = sp;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res_1 } = sp.user;

      return {
        ...res,
        ticket_messages: res.ticket_messages
          .map((tm) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...res } = tm.sender;

            return {
              ...tm,
              sender: res,
            };
          })
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
        user: res_1,
      };
    });
  }

  async getOne(id: string): Promise<SupportTicket> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });

    if (!supportTicket)
      throw new NotFoundException('Support Ticket not found.');

    return supportTicket;
  }

  async createOne(
    createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<void> {
    const { userId, ...res } = createSupportTicketDto;

    const supportTicket = this.supportTicketRepository.create(res);

    await this.supportTicketRepository.save(supportTicket);

    await this.ticketMessagesService.createTicketMessage({
      message: res.original_request,
      sender_type: 'user',
      supportTicketId: supportTicket.id,
      senderId: userId,
    });

    if (userId) {
      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (!user) throw new NotFoundException('User Not Found.');

      await this.supportTicketRepository
        .createQueryBuilder()
        .relation(SupportTicket, 'user')
        .of(supportTicket.id)
        .set(user.id);
    }
  }

  async updateOne(
    updateSupportTicketDto: UpdateSupportTicketDto,
    id: string,
  ): Promise<void> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });

    if (!supportTicket)
      throw new NotFoundException('Support Ticket Not Found.');

    const { userId, response, status } = updateSupportTicketDto;

    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    const isAdminUser = user.roles.some((role) => role.name === 'admin');

    await this.ticketMessagesService.createTicketMessage({
      message: response,
      sender_type: isAdminUser ? 'admin' : 'user',
      supportTicketId: supportTicket.id,
      senderId: user.id,
    });

    if (status) {
      await this.supportTicketRepository.update({ id }, { status });
    }
  }

  public async deleteOne(
    id: string,
    queries?: Record<string, string>,
  ): Promise<void> {
    if (queries && queries.userId) {
      const supportTicket = await this.supportTicketRepository.findOneBy({
        id,
      });

      if (!supportTicket)
        throw new NotFoundException('Support Ticket Not Found.');

      await this.supportTicketRepository.delete({ id });
    } else {
      throw new Error('Internal Server Error!');
    }
  }

  public async deleteOneByAdmin(id: string): Promise<void> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });
    if (!supportTicket)
      throw new NotFoundException('Support Ticket not found.');
    await this.supportTicketRepository.delete({ id });
  }
}
