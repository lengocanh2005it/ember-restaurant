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
import { CreateReservationDto } from 'src/reservations/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/reservations/dtos/update-reservation.dto';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN, Role.MANAGER)
  async findAll(
    @Query() queries: Record<string, string>,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAll(queries);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createOne(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<any> {
    return await this.reservationService.createOne(createReservationDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MANAGER)
  async updateOne(
    @Body() updateReservationDto: UpdateReservationDto,
    @Param('id') id: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.updateOne(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    await this.reservationService.deleteOne(id);
    return await this.reservationService.findAll(queries);
  }
}
