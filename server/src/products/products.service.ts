import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { UpdateProductDto } from 'src/products/dtos/update-product.dto';
import { Product } from 'src/products/entities/products.entity';
import { generateProducts } from 'src/utils/utils';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.initializeProducts();
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findAllFeaturedProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        is_featured: true,
      },
    });
  }

  async findOne(
    id: string,
    queries?: Record<string, string>,
  ): Promise<Product> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id });

    if (!(await query.getOne()))
      throw new NotFoundException('Product Not Found.');

    if (queries && queries.option === 'reviews') {
      query
        .leftJoinAndSelect('product.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'user');

      return await query.getOne();
    }

    return await query.getOne();
  }

  async createOne(createProductDto: CreateProductDto): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    if (product) throw new BadRequestException('Product has been existed.');

    const newProduct = this.productRepository.create(createProductDto);

    await this.productRepository.save(newProduct);

    return await this.findAll();
  }

  async updateOne(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product[]> {
    await this.productRepository.update({ id }, updateProductDto);

    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Product[]> {
    await this.productRepository.delete({ id });

    return await this.findAll();
  }

  async deleteReviewsOfProduct(
    id: string,
    queries: Record<string, string>,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product Not Found.');

    const { reviewId } = queries;

    if (queries && reviewId) {
      await this.dataSource
        .createQueryBuilder()
        .relation(Product, 'reviews')
        .of(id)
        .remove(reviewId);
    }

    return await this.findOne(id, queries);
  }

  public async updateProduct(
    productId: string,
    totalRatingNumbers: number,
    totalCount: number,
  ): Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) throw new BadRequestException('Product not found.');

    await this.productRepository.update(
      { id: productId },
      {
        rating_count: totalCount,
        average_rating: parseFloat(
          (totalRatingNumbers / totalCount).toFixed(2),
        ),
      },
    );
  }

  public transformProductAndQuantityToProducts = async (
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<Array<{ product: Product; quantity: number }>> => {
    const products = [];

    for (const item of items) {
      const { productId, quantity } = item;

      const findProduct = await this.productRepository.findOneBy({
        id: productId,
      });

      if (!findProduct) throw new NotFoundException('Product Not Found.');

      products.push({
        product: findProduct,
        quantity,
      });
    }

    return products as Array<{ product: Product; quantity: number }>;
  };

  public initializeProducts = async (): Promise<void> => {
    const products = generateProducts();

    for (const product of products) {
      const existingProduct = await this.productRepository.findOneBy({
        name: product.name,
      });

      if (!existingProduct) {
        await this.productRepository.save(product);
      }
    }
  };

  public updateAverageRatingNumber = async (
    productId: string,
    ratingNumber: number,
  ): Promise<void> => {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) throw new NotFoundException('Product Not Found.');

    const { rating_count, average_rating } = product;

    await this.productRepository.update(
      {
        id: productId,
      },
      {
        rating_count: rating_count + 1,
        average_rating: (ratingNumber + average_rating) / (rating_count + 1),
      },
    );
  };

  public updateStockNumberProduct = async (
    productId: string,
    quantity: number,
  ): Promise<void> => {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) throw new NotFoundException('Product Not Found.');

    if (quantity > product.stock)
      throw new BadRequestException(
        'The inventory quantity of this dish is insufficient.',
      );

    await this.productRepository.update(
      {
        id: productId,
      },
      {
        stock: product.stock - quantity,
      },
    );
  };

  public transformProducts = async (
    items: Array<{
      is_available: boolean;
      name: string;
      quantity: number;
      price: number;
    }>,
  ): Promise<Array<{ product: Product; quantity: number }>> => {
    const results = [] as Array<{ product: Product; quantity: number }>;

    for (const item of items) {
      const findProduct = await this.productRepository.findOneBy({
        name: item.name,
      });

      if (!findProduct) throw new NotFoundException('Product Not Found.');

      results.push({ product: findProduct, quantity: item.quantity });
    }

    return results;
  };
}
