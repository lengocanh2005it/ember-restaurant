import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { SupportTicketService } from 'src/support_ticket/support-ticket.service';
import { TicketMessage } from 'src/ticket_messages/entities/ticket_message.entity';
import { TicketMessagesService } from 'src/ticket_messages/ticket_messages.service';

@Controller('ticket_messages')
export class TicketMessagesController {
  constructor(
    private readonly ticketMessagesService: TicketMessagesService,
    private readonly supportTicketService: SupportTicketService,
  ) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteTicketMessage(
    @Param('id') id: string,
  ): Promise<Record<string, string | TicketMessage[]>> {
    await this.ticketMessagesService.handleDeleteTicketMessage(id);

    return {
      support_tickets: await this.supportTicketService.getAll(),
    };
  }
}
