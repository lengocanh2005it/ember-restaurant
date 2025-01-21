import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { CreateTableDto } from 'src/tables/dtos/create-table.dto';
import { UpdateTableDto } from 'src/tables/dtos/update-table.dto';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from 'src/tables/tables.service';

@Controller('tables')
@UseInterceptors(ClassSerializerInterceptor)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @SkipThrottle()
  async findAll(@Query() queries: Record<string, string>): Promise<Table[]> {
    return await this.tablesService.findAll(queries);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<Table> {
    return await this.tablesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async createOne(@Body() createTableDto: CreateTableDto): Promise<Table[]> {
    return await this.tablesService.createOne(createTableDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateOne(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<any> {
    return await this.tablesService.updateOne(updateTableDto, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id') id: string): Promise<Table[]> {
    return await this.tablesService.deleteOne(id);
  }
}
