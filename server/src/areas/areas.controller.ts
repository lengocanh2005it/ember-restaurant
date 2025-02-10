import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AreasService } from 'src/areas/areas.service';
import { CreateAreaDto } from 'src/areas/dtos/create-area.dto';
import { UpdateAreaDto } from 'src/areas/dtos/update-area.dto';
import { Area } from 'src/areas/entities/areas.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('areas')
@UseInterceptors(ClassSerializerInterceptor)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findAll(): Promise<Area[]> {
    return await this.areasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findOne(@Param('id') id: string): Promise<Area> {
    return await this.areasService.findOne(id);
  }

  @Post()
  async createOne(@Body() createAreaDto: CreateAreaDto): Promise<Area[]> {
    await this.areasService.createOne(createAreaDto);
    return await this.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateOne(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Record<string, Area | Area[]>> {
    return await this.areasService.updateOne(updateAreaDto, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id') id: string): Promise<Area[]> {
    return await this.areasService.deleteOne(id);
  }
}
