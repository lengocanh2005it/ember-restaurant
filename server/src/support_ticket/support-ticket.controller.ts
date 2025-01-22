import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ): Promise<any> {
    await this.supportTicketService.createOne(createSupportTicketDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(createSupportTicketDto.userId);

    console.log(res);

    return res;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateOne(
    @Body() updateSupportTicketDto: UpdateSupportTicketDto,
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    const { userId } = updateSupportTicketDto;

    await this.supportTicketService.updateOne(updateSupportTicketDto, id);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(userId);

    return {
      support_tickets:
        queries.type === 'admin'
          ? await this.supportTicketService.getAll()
          : await this.usersService.findOne(userId),
      profile: res,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    await this.supportTicketService.deleteOne(id, queries);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...res } =
      await this.usersService.findOne(queries.userId);

    return {
      support_tickets_user: res,
      support_tickets: await this.getAll(),
    };
  }
}
