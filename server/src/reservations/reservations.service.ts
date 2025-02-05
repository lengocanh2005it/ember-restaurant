import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DiscountContext } from 'src/discounts/discount.context';
import { DiscountsService } from 'src/discounts/discounts.service';
import { PaymentsService } from 'src/payments/payments.service';
import { PromotionsService } from 'src/promotions/promotions.service';
import { CreateReservationDto } from 'src/reservations/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/reservations/dtos/update-reservation.dto';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { TablesService } from 'src/tables/tables.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly tablesService: TablesService,
    private readonly paymentsService: PaymentsService,
    private readonly discountsService: DiscountsService,
    private readonly discountContext: DiscountContext,
    private readonly userDiscountService: UserDiscountService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async findAll(queries: Record<string, string>): Promise<any> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return {
      reservations: {
        currentReservations: await this.getReservationsOfUser(
          queries.userId,
          startOfToday,
          endOfToday,
        ),
        historyReservations: await this.getReservationsOfUser(
          queries.userId,
          startOfToday,
        ),
      },
    };
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) throw new NotFoundException('Reservation Not Found.');

    return reservation;
  }

  async createOne(createReservationDto: CreateReservationDto): Promise<any> {
    const { userId, tableIds, areaId, discountId, promotionCode, ...res } =
      createReservationDto;

    let total_price = await this.tablesService.calculateTotalPrice(tableIds);
    let discountedAmount = 0;

    if (discountId) {
      const discount =
        await this.discountsService.checkValidOfDiscount(discountId);

      if (discount) {
        const { type, value } = discount;

        this.discountContext.setStrategy(type, value);

        discountedAmount = this.discountContext.calculateDiscount(total_price);

        total_price = total_price - discountedAmount;

        await this.userDiscountService.decreaseUserDiscountQuantity(
          userId,
          discountId,
        );
      }
    }

    if (promotionCode) {
      const discountFromPromotionCode =
        await this.promotionsService.checkPromotionCode(promotionCode);

      if (discountFromPromotionCode) {
        const { type, value } = discountFromPromotionCode;

        this.discountContext.setStrategy(type, value);

        discountedAmount = this.discountContext.calculateDiscount(total_price);

        total_price = total_price - discountedAmount;
      }
    }

    const reservation = this.reservationRepository.create({
      ...res,
      total_price,
      original_price: total_price + discountedAmount,
      discount_price: discountedAmount,
    });

    await this.reservationRepository.save(reservation);

    if (discountId) {
      await this.reservationRepository
        .createQueryBuilder('reservations')
        .relation(Reservation, 'discounts')
        .of(reservation.id)
        .add(discountId);
    }

    if (promotionCode) {
      const discountFromPromotionCode =
        await this.promotionsService.checkPromotionCode(promotionCode);

      if (discountFromPromotionCode) {
        await this.reservationRepository
          .createQueryBuilder('reservations')
          .relation(Reservation, 'discounts')
          .of(reservation.id)
          .add(discountFromPromotionCode.id);
      }
    }

    await this.tablesService.addTablesToReservation(
      tableIds,
      reservation.id,
      areaId,
      res.guests_count,
    );

    await this.dataSource
      .createQueryBuilder()
      .relation(Reservation, 'user')
      .of(reservation.id)
      .set(userId);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return {
      reservations: {
        currentReservations: await this.getReservationsOfUser(
          userId,
          startOfDay,
          endOfDay,
        ),
        historyReservations: await this.getReservationsOfUser(
          userId,
          startOfDay,
        ),
      },
    };
  }

  async deleteOne(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
      },
      relations: ['tables'],
    });

    if (!reservation) throw new NotFoundException('Reservation Not Found.');

    await this.tablesService.resetStatusOfTables(reservation.tables);

    await this.reservationRepository.delete({ id });
  }

  async updateOne(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<any> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
      },
      relations: ['tables', 'payment'],
    });

    if (!reservation) throw new NotFoundException('Reservation Not Found.');

    const { payment_method, userId, areaId, tableIds, ...res } =
      updateReservationDto;

    await this.tablesService.updateTablesOfReservation(
      tableIds,
      areaId,
      reservation,
      res.guests_count,
    );

    await this.reservationRepository.update({ id }, res);

    const total_price = await this.tablesService.calculateTotalPrice(tableIds);

    await this.reservationRepository.update(
      { id },
      {
        total_price,
      },
    );

    if (reservation.payment.payment_method !== payment_method) {
      await this.paymentsService.updatePaymentMethod(
        reservation.payment.id,
        payment_method,
        total_price,
      );
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return {
      reservations: {
        currentReservations: await this.getReservationsOfUser(
          userId,
          startOfToday,
          endOfToday,
        ),
        historyReservations: await this.getReservationsOfUser(
          userId,
          startOfToday,
        ),
      },
    };
  }

  public async transformReservationIds(
    reservationIds: string[],
  ): Promise<Reservation[]> {
    const reservations = [];
    for (const reservationId of reservationIds) {
      const reservation = await this.reservationRepository.findOneBy({
        id: reservationId,
      });
      if (!reservation) throw new NotFoundException('Reservation not found.');

      reservations.push(reservation);
    }

    return reservations;
  }

  public getReservationsOfUser = async (
    userId: string,
    startOfDay: Date,
    endOfDay?: Date,
  ): Promise<any> => {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.reviews', 'review')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.tables', 'tables')
      .leftJoinAndSelect('reservation.payment', 'payment')
      .leftJoinAndSelect('reservation.discounts', 'discounts')
      .leftJoinAndSelect('tables.area', 'area')
      .select([
        'reservation',
        'review',
        'tables',
        'payment',
        'area',
        'user',
        'discounts',
      ])
      .where('user.id = :userId', { userId });

    if (endOfDay) {
      query.andWhere(
        `reservation.createdAt BETWEEN :startOfDay AND :endOfDay`,
        {
          startOfDay,
          endOfDay,
        },
      );
    } else {
      query.andWhere(`reservation.createdAt < :startOfDay`, {
        startOfDay,
      });
    }

    //query.orderBy('reservation.date_time', 'ASC');
    query.orderBy('reservation.createdAt', 'DESC');

    return await query.getMany();
  };

  public updatePaymentOfReservation = async (reservationId: string) => {
    const reservation = await this.reservationRepository.findOneBy({
      id: reservationId,
    });

    if (!reservation) throw new NotFoundException('Reservation Not Found.');

    await this.reservationRepository.update(
      { id: reservationId },
      {
        is_paid: true,
      },
    );
  };
}
