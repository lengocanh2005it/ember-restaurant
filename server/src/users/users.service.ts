import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/carts.entity';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Review } from 'src/reviews/entities/reviews.entity';
import { RolesService } from 'src/roles/roles.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { encodePassword } from 'src/utils';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly ordersService: OrdersService,
    private readonly rolesService: RolesService,
    private readonly discountsService: DiscountsService,
    private readonly userDiscountService: UserDiscountService,
    private readonly reservationsService: ReservationsService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(queries?: Record<string, string>): Promise<User[]> {
    const filters: any = {};

    if (queries && Object.keys(queries).length > 0) {
      const { username, sort, page, limit } = queries;

      if (username) {
        filters.username = Like(`%${username}%`);
      }

      const limitValue = Number(limit) || 10;
      const pageValue = Number(page) || 1;
      const sortOrder = sort === 'desc' ? 'DESC' : 'ASC';

      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .where(filters)
        .orderBy('user.username', sortOrder)
        .skip((pageValue - 1) * limitValue)
        .take(limitValue)
        .getMany();

      return users
        .filter(
          (user) =>
            user.roles.length === 1 &&
            user.roles.map((role) => role.name).includes('user'),
        )
        .map((user) => ({
          ...user,
          roles: user.roles
            .filter((role) => role.name === 'user')
            .map((role) => role.name),
        })) as any;
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany();

    return users
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .filter(
        (user) =>
          user.roles.length === 1 &&
          user.roles.map((role) => role.name).includes('user'),
      )
      .map((user) => ({
        ...user,
        roles: user.roles
          .filter((role) => role.name === 'user')
          .map((role) => role.name),
      })) as any;
  }

  async findOne(id: string, queries?: Record<string, string>): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    if (queries && Object.keys(queries).length > 0) {
      return await this.handleQueries(queries, id);
    }

    return {
      ...user,
      roles: user.roles.map((role) => role.name),
    } as any;
  }

  async handleFindUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async handleFindUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) throw new NotFoundException('User Not Found.');

    return user;
  }

  async handleCreateUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({
      username,
    });

    const existingUserAdmin = await this.userRepository.findOneBy({
      username: this.configService.get('ADMIN_NAME'),
    });

    if (existingUser) throw new BadRequestException('Username Has Existed.');

    if (!existingUserAdmin) {
      await this.handleGenerateAdmin({
        username: this.configService.get('ADMIN_NAME'),
        password: this.configService.get('ADMIN_PASSWORD'),
      });
    }

    const user = this.userRepository.create({
      username,
      password: encodePassword(password),
    });

    await this.userRepository.save(user);

    const role = await this.rolesService.findRoleByName('user');

    await this.userRepository
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(user.id)
      .add(role.id);

    return user;
  }

  async handleUpdateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const isExistedEmail = await this.userRepository.findOne({
      where: {
        email: updateUserDto.email,
      },
    });

    if (isExistedEmail && id !== isExistedEmail.id)
      throw new BadRequestException('Email has existed!');

    await this.userRepository.update({ id }, updateUserDto);

    return await this.findOne(id);
  }

  async handleUpdateImageOfUser(id: string, imageUrl: string): Promise<void> {
    await this.userRepository.update(
      { id },
      {
        image: imageUrl,
      },
    );
  }

  async handleDeleteUserById(id: string): Promise<User[]> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    await this.userRepository.delete({ id });

    return await this.findAll();
  }

  async handleFindCartsOfUser(id: string): Promise<Cart[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['carts', 'carts.product', 'carts.user'],
    });

    if (!user) throw new BadRequestException('User not found.');

    return user.carts;
  }

  async handleFindDiscountsOfUser(id: string): Promise<Discount[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['userDiscounts', 'userDiscounts.discount'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    return user.userDiscounts.map((userDiscount) => ({
      discount: userDiscount.discount,
      quantity: userDiscount.quantity,
    })) as any;
  }

  async handleFindRequestsOfUser(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'support_tickets',
        'support_tickets.user',
        'support_tickets.ticket_messages',
        'support_tickets.ticket_messages.sender',
        'support_tickets.ticket_messages.support_ticket',
      ],
    });

    return user.support_tickets
      .map((st) => ({
        ...st,
        ticket_messages: st.ticket_messages.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
        ),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async handleFindReservationsOfUser(id: string): Promise<any> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const currentReservations =
      await this.reservationsService.getReservationsOfUser(
        id,
        startOfDay,
        endOfDay,
      );

    const historyReservations =
      await this.reservationsService.getReservationsOfUser(id, startOfDay);

    return {
      currentReservations,
      historyReservations,
    };
  }

  async handleFindReviewOfUser(id: string): Promise<Review[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['reviews'],
    });
    if (!user) throw new BadRequestException('User not found.');

    return user.reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async handleFindOrdersOfUsers(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const currentOrders = await this.ordersService.findOneByUserId(
      id,
      false,
      startOfDay,
      endOfDay,
    );

    const historyOrders = await this.ordersService.findOneByUserId(id, true);

    const ordersWithProducts = currentOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((order) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, deletedAt, ...res } = order;

        return res;
      });

    const historyOrdersWithProducts = historyOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((historyOrder) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, deletedAt, ...res } = historyOrder;

        return res;
      });

    return {
      currentOrders: ordersWithProducts,
      historyOrders: historyOrdersWithProducts,
    };
  }

  async handleUpdatePassword(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('User Not Found.');

    await this.userRepository.update(
      { email },
      {
        password: newPassword,
      },
    );
  }

  async handleRedeemPoints(
    id: string,
    queries?: Record<string, string>,
  ): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    if (queries && queries.loyalty_points === 'true') {
      const { loyalty_points } = user;

      if (loyalty_points < 500)
        throw new BadRequestException("You don't have enough loyalty point!");

      const discount = await this.discountsService.findOneByValue(10);

      await this.userDiscountService.addDiscountToUser(user, discount);

      await this.userRepository.update(
        {
          id,
        },
        {
          loyalty_points: loyalty_points - 500,
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, createdAt, updatedAt, ...res } = await this.findOne(id);

      return {
        discounts: await this.handleFindDiscountsOfUser(id),
        profile: res,
      };
    }
  }

  public async handleGenerateAdmin(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const user = this.userRepository.create({
      username,
      password: encodePassword(password),
      name: this.configService.get<string>('ADMIN_FULL_NAME'),
    });

    await this.userRepository.save(user);

    const adminRole = await this.rolesService.findRoleByName('admin');
    const userRole = await this.rolesService.findRoleByName('user');

    await this.userRepository
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(user.id)
      .add([adminRole.id, userRole.id]);
  }

  public async handleAddReviewToUser(
    userId: string,
    review: Review,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new BadRequestException('User Not Found.');

    await this.dataSource
      .createQueryBuilder()
      .relation(User, 'reviews')
      .of(userId)
      .add(review.id);
  }

  public handleGetPaymentsOfUser = async (id: string): Promise<Payment[]> => {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['payments'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    return user.payments;
  };

  public handleUpdateProfileUser = async (id: string) => {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    await this.userRepository.update(
      { id },
      {
        total_orders: user.total_orders + 1,
        loyalty_points: user.loyalty_points + 10,
      },
    );
  };

  public handleFindUserBySocialId = async (
    socialField: 'google_id' | 'facebook_id',
    socialId: string,
  ): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: {
        [socialField]: socialId,
      },
      relations: ['roles'],
    });

    return user;
  };

  public handleCreateUserBySocialId = async (
    socialField: 'google_id' | 'facebook_id',
    socialId: string,
    name: string,
    email: string,
  ): Promise<User> => {
    const user = this.userRepository.create({
      [socialField]: socialId,
      name,
      email,
    });

    await this.userRepository.save(user);

    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['roles'],
    });
  };

  public handleUpdateThemeOfUser = async (
    id: string,
    theme: string,
  ): Promise<void> => {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    await this.userRepository.update({ id }, { theme });
  };

  async handleQueries(
    queries: Record<string, string>,
    id: string,
  ): Promise<any> {
    const handlers: Record<string, (value?: string) => Promise<any>> = {
      reservations: () => this.handleFindReservationsOfUser(id),
      email: (value) => this.handleFindUserByEmail(value),
      orders: () => this.handleFindOrdersOfUsers(id),
      carts: () => this.handleFindCartsOfUser(id),
      discounts: () => this.handleFindDiscountsOfUser(id),
      reviews: () => this.handleFindReviewOfUser(id),
      support_tickets: () => this.handleFindRequestsOfUser(id),
    };

    for (const [key, value] of Object.entries(queries)) {
      if (handlers[key]) {
        if (key === 'email') {
          return await handlers[key](value);
        } else if (value === 'true') {
          return await handlers[key]();
        }
      }
    }

    throw new Error('Invalid query parameter');
  }
}
