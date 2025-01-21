import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDiscountService {
  constructor(
    @InjectRepository(UserDiscount)
    private readonly userDiscountRepository: Repository<UserDiscount>,
  ) {}

  public addDiscountToUser = async (
    user: User,
    discount: Discount,
  ): Promise<void> => {
    const isExistedUserAndDiscount = await this.userDiscountRepository.findOne({
      where: {
        discount: { id: discount.id },
        user: { id: user.id },
      },
    });

    if (isExistedUserAndDiscount) {
      await this.userDiscountRepository
        .createQueryBuilder()
        .update()
        .set({
          quantity: isExistedUserAndDiscount.quantity + 1,
        })
        .where('user.id = :userId', { userId: user.id })
        .andWhere('discount.id = :discountId', { discountId: discount.id })
        .execute();
    } else {
      const newUserDiscount = this.userDiscountRepository.create({
        user,
        discount,
        quantity: 1,
        status: 'unused',
      });

      await this.userDiscountRepository.save(newUserDiscount);
    }
  };

  public decreaseUserDiscountQuantity = async (
    userId: string,
    discountId: string,
  ): Promise<void> => {
    const condition = {
      user: { id: userId },
      discount: { id: discountId },
    };

    const userDiscount = await this.userDiscountRepository.findOne({
      where: condition,
    });

    if (!userDiscount)
      throw new NotFoundException("User doesn't have this discount.");

    if (userDiscount.quantity <= 1) {
      await this.userDiscountRepository.delete(condition);
    } else {
      await this.userDiscountRepository.update(condition, {
        quantity: userDiscount.quantity - 1,
        status: 'used',
      });

      if (userDiscount.date_used === null) {
        await this.userDiscountRepository.update(condition, {
          date_used: new Date(),
        });
      }
    }
  };
}
