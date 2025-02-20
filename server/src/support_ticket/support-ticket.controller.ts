import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { CreateSupportTicketDto } from 'src/support_ticket/dtos/create-support-ticket.dto';
import { UpdateSupportTicketDto } from 'src/support_ticket/dtos/update-support-ticket.dto';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { SupportTicketService } from 'src/support_ticket/support-ticket.service';
import { UsersService } from 'src/users/users.service';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(
    private readonly supportTicketService: SupportTicketService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getAll(): Promise<any> {
    return await this.supportTicketService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getOne(@Param('id') id: string): Promise<SupportTicket> {
    return await this.supportTicketService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async createOne(
    @Body() createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<Record<string, SupportTicket[]>> {
    await this.supportTicketService.createOne(createSupportTicketDto);

    return {
      support_tickets: await this.supportTicketService.getAll(),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateOne(
    @Body() updateSupportTicketDto: UpdateSupportTicketDto,
    @Param('id') id: string,
  ): Promise<any> {
    const { userId } = updateSupportTicketDto;

    await this.supportTicketService.updateOne(updateSupportTicketDto, id);

    return {
      support_tickets: await this.supportTicketService.getAll(),
      profile: await this.usersService.findOne(userId),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
  ): Promise<Record<string, SupportTicket[]>> {
    await this.supportTicketService.deleteOne(id);

    return {
      support_tickets: await this.getAll(),
    };
  }
}
