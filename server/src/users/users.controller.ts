import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersInterceptor } from 'src/users/users.interceptor';
import { UsersService } from 'src/users/users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(UsersInterceptor)
  async handleFindUsers(
    @Query() queries: Record<string, string>,
  ): Promise<User[]> {
    return await this.usersService.findAll(queries);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(UsersInterceptor)
  async handleFindUserById(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<User> {
    return await this.usersService.findOne(id, queries);
  }

  @Post()
  @UseInterceptors(UsersInterceptor)
  async handleCreateUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.handleCreateUser(createUserDto);
  }

  @Post('/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleRedeemPoint(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    return await this.usersService.handleRedeemPoints(id, queries);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(UsersInterceptor)
  async handleUpdateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.handleUpdateUserById(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(UsersInterceptor)
  async handleDeleteUserById(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.handleDeleteUserById(id);
  }
}
