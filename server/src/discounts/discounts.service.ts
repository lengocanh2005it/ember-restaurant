import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountContext } from 'src/discounts/discount.context';
import { CreateDiscountDto } from 'src/discounts/dtos/create-discount.dto';
import { UpdateDiscountDto } from 'src/discounts/dtos/update-discount.dto';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { generateDiscount } from 'src/utils/utils';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class DiscountsService implements OnModuleInit {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    private readonly discountContext: DiscountContext,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.updateExpirationDiscounts();
    await this.initialDiscounts();
    await this.updateEndDateOfDiscount();
  }

  async findAll(queries?: Record<string, string>): Promise<Discount[]> {
    let discounts = await this.discountRepository.find();

    if (queries && queries.type) {
      discounts = await this.discountRepository.find({
        where: {
          type: queries.type,
        },
      });
    }

    return discounts;
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOneBy({ id });
    return discount;
  }

  async findOneByValue(value: number): Promise<Discount> {
    const discount = await this.discountRepository.findOneBy({ value });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    return discount;
  }

  async createOne(createDiscountDto: CreateDiscountDto): Promise<Discount[]> {
    const discount = this.discountRepository.create(createDiscountDto);
    await this.discountRepository.save(discount);
    return await this.findAll();
  }

  async updateOne(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount[]> {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    await this.discountRepository.update({ id }, updateDiscountDto);
    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Discount[]> {
    await this.discountRepository.delete({ id });
    return await this.findAll();
  }

  async updateExpirationDiscounts() {
    const today = new Date();

    await this.discountRepository.update(
      { is_active: true, end_date: LessThan(today) },
      { is_active: false },
    );
  }

  public initialDiscounts = async (): Promise<void> => {
    const discounts = [
      generateDiscount(5),
      generateDiscount(10),
      generateDiscount(15),
      generateDiscount(20),
      generateDiscount(50),
    ];

    for (const discount of discounts) {
      const { value, type } = discount;

      const existingDiscount = await this.discountRepository.findOne({
        where: {
          value,
          type,
        },
      });

      if (!existingDiscount) {
        await this.discountRepository.save(discount);
      }
    }
  };

  public updateEndDateOfDiscount = async (): Promise<void> => {
    const discounts = await this.discountRepository.find();

    for (const discount of discounts) {
      if (discount) {
        const { start_date, end_date } = discount;
        const today = new Date();
        const endDate = new Date(end_date);
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (start_date < end_date && endDate < today) {
          const newStartDate = new Date();
          const newEndDate = new Date(newStartDate);
          newEndDate.setDate(newStartDate.getDate() + 7);

          await this.discountRepository.update(
            {
              id: discount.id,
            },
            {
              start_date: newStartDate,
              end_date: newEndDate,
              is_active: true,
            },
          );
        }
      }
    }
  };

  public findDiscountByValueAndType = async (
    value: number,
    currency: string,
  ): Promise<Discount> => {
    const discount = await this.discountRepository.findOne({
      where: {
        value,
        currency,
      },
    });

    if (!discount) throw new NotFoundException('Discount Not Found.');

    return discount;
  };

  public checkValidOfDiscount = async (
    discountId: string,
  ): Promise<Discount | null> => {
    const discount = await this.discountRepository.findOneBy({
      id: discountId,
    });

    if (!discount) return null;

    const today = new Date();

    const isValid =
      discount.start_date.getTime() < today.getTime() &&
      discount.end_date.getTime() > today.getTime();

    if (!isValid || !discount.is_active) {
      await this.discountRepository.delete({
        id: discountId,
      });

      return null;
    }

    return discount;
  };

  public applyDiscount(
    amount: number,
    discountType: string,
    value: number,
  ): number {
    this.discountContext.setStrategy(discountType, value);

    const discount = this.discountContext.calculateDiscount(amount);

    const finalAmount = amount - discount;

    return finalAmount;
  }
}
