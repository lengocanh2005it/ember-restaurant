import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { CreatePromotionDto } from 'src/promotions/dtos/create-promotion.dto';
import { UpdatePromotionDto } from 'src/promotions/dtos/update-promotion.dto';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private readonly discountsService: DiscountsService,
  ) {}

  async onModuleInit() {
    await this.updateExpirationPromotions();
  }

  async getPromotions(): Promise<Promotion[]> {
    const promotions = await this.promotionRepository.find({
      where: { status: 'active' },
      relations: ['discount'],
    });

    return promotions.map((promotion) => ({
      ...promotion,
      discount: {
        productId: promotion.discount.id,
        value: promotion.discount.value,
        type: promotion.discount.type,
      },
    })) as any;
  }

  async getPromotion(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOneBy({
      id,
      status: 'active',
    });

    if (!promotion) throw new NotFoundException('Promotion Not Found.');

    return promotion;
  }

  async createPromotion(
    createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion[]> {
    const { discountId } = createPromotionDto;

    const promotion = this.promotionRepository.create(createPromotionDto);

    await this.promotionRepository.save(promotion);

    if (discountId) {
      await this.promotionRepository
        .createQueryBuilder()
        .relation(Promotion, 'discount')
        .of(promotion.id)
        .set(discountId);
    }

    return await this.getPromotions();
  }

  async deletePromotion(id: string): Promise<Promotion[]> {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) throw new NotFoundException('Promotion Not Found.');
    await this.promotionRepository.delete({ id });
    return await this.getPromotions();
  }

  async updatePromotion(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion[]> {
    const promotion = await this.promotionRepository.findOneBy({ id });

    if (!promotion) throw new NotFoundException('Promotion Not Found.');

    await this.promotionRepository.update({ id }, updatePromotionDto);

    return await this.getPromotions();
  }

  async updateExpirationPromotions() {
    const today = new Date();

    await this.promotionRepository
      .createQueryBuilder()
      .update(Promotion)
      .set({ status: 'inactive' })
      .where('end_date < :today', { today })
      .andWhere('status = :status', { status: 'active' })
      .execute();
  }

  public checkPromotionCode = async (
    promotionCode: string,
  ): Promise<Discount> => {
    const promotion = await this.promotionRepository.findOne({
      where: {
        code: promotionCode,
      },
      relations: ['discount'],
    });

    if (!promotion) throw new NotFoundException('Promotion Not Found.');

    const startDate = new Date(promotion.start_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(promotion.end_date);
    endDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isEligible = startDate <= today && today <= endDate;

    if (!isEligible) throw new BadRequestException('Promotion has expired.');

    return await this.discountsService.checkValidOfDiscount(
      promotion.discount.id,
    );
  };
}
