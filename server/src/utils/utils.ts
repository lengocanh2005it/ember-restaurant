import { CreateDiscountDto } from 'src/discounts/dtos/create-discount.dto';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/interfaces/api-response.interface';

export const generateID = (prefix: string) => {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return prefix + randomPart;
};

export const calculateNumber = (value: number): number => {
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};

export const handleFormatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let period = 'AM';
  let hour = parseInt(hours, 10);

  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      hour -= 12;
    }
  } else if (hour === 0) {
    hour = 12;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes} ${period}`;
};

export const generateRandomValue = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const setRelation = async (
  repository: Repository<any>,
  entity: any,
  entityInstance: any,
  relation: string,
  targetId: number | string,
  action: 'set' | 'add' = 'set',
): Promise<void> => {
  const queryBuilder = repository
    .createQueryBuilder()
    .relation(entity, relation)
    .of(entityInstance.id);

  if (action === 'set') {
    await queryBuilder.set(targetId);
  } else if (action === 'add') {
    await queryBuilder.add(targetId);
  } else {
    throw new Error(`Unsupported action: ${action}`);
  }
};

export const generateDiscount = (
  value: number,
  description?: string,
): CreateDiscountDto => {
  const start_date = new Date();
  const end_date = new Date(start_date);
  end_date.setDate(start_date.getDate() + 7);

  return {
    type: 'percentage',
    value,
    description,
    start_date,
    end_date,
    is_active: true,
    currency: 'usd',
  };
};

export const generateProducts = (): CreateProductDto[] => {
  return [
    {
      name: 'Tasty Navajo Bread',
      description:
        'Soft and fluffy Navajo bread, perfectly fried to golden brown and served with a variety of toppings.',
      price: 12.2,
      stock: 100,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735439862/specialty_dish-5_kfdfrw.png',
      category: 'snack',
      ingredients: 'Flour, baking powder, salt, water, vegetable oil',
      is_featured: true,
    },

    {
      name: 'Grilled Salmon',
      description:
        'A perfectly grilled salmon filet served with lemon butter sauce.',
      price: 12.56,
      stock: 150,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464360/grill_salmon_jxheqk.png',
      category: 'main_course',
      ingredients: 'Salmon, olive oil, lemon, garlic, salt, pepper, parsley',
      is_featured: true,
    },

    {
      name: 'Stir-Fried Noodles',
      description:
        'Delicious stir-fried noodles with fresh vegetables and assorted meats, full of flavor.',
      price: 15.6,
      stock: 50,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464427/main_courses-6_el1ii7.png',
      category: 'main_course',
      ingredients:
        'Noodles, chicken, beef, shrimp, bell peppers, carrots, soy sauce',
      is_featured: true,
    },

    {
      name: 'Fried Chicken',
      description:
        'Crispy and juicy fried chicken, seasoned with a blend of spices.',
      price: 15.24,
      stock: 100,
      image:
        'https://res.cloudinary.com/daiqcjyk9/image/upload/v1735464578/fried_chicken_o5h7si.png',
      category: 'appetizer',
      ingredients:
        'Chicken, flour, eggs, breadcrumbs, garlic powder, paprika, salt, pepper, oil',
      is_featured: true,
    },
  ];
};

export const encodePassword = (password: string) => {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, SALT);
};

export const formatApiResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
  error?: string,
): ApiResponse => {
  return {
    statusCode,
    message,
    ...(data && { data }),
    ...(error && { error }),
  };
};
