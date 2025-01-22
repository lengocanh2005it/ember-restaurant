import {
  CreateOrderDto,
  CreateProductOfOrderDto,
} from "@/api/orders/utils/types";
import { formSchema } from "@/components/CreateOrder";
import { StatusEnum } from "@/config/enums/enums";
import { Cart } from "@/utils/types";
import { CalendarDate, Time } from "@internationalized/date";
import { toast, ToastPosition } from "react-toastify";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const handleTransportOrderName = (carts: Cart[]): string => {
  return carts
    ?.map((cart) => {
      return {
        name: cart.product.name,
        quantity: cart.quantity,
      };
    })
    ?.map((item) => {
      return `${item.name} (${item.quantity})`;
    })
    ?.join(", ");
};

export const calculateNumber = (value: number): number => {
  return parseFloat((Math.round(value * 100) / 100).toFixed(2));
};

export const showErrorToast = (
  message: string,
  position: string,
  styles: { backgroundColor: string; color: string }
): void => {
  toast.error(message, {
    position: position as ToastPosition,
    style: styles,
  });
};

export const showSuccessToast = (
  message: string,
  position: string,
  styles: { backgroundColor: string; color: string }
): void => {
  toast.success(message, {
    position: position as ToastPosition,
    style: styles,
  });
};

export const handleCreateOrder = (
  values: z.infer<typeof formSchema>,
  carts: Cart[],
  userId: string,
  total_price: number,
  discountId?: string
) => {
  const {
    phone_number,
    note,
    delivery_address,
    delivery_method,
    payment_method,
  } = values;

  const order: CreateOrderDto = {
    userId,
    phone_number,
    note,
    delivery_address,
    delivery_method,
    payment_method,
    status: StatusEnum.PENDING,
    total_price,
    discountId,
  };

  const products: CreateProductOfOrderDto[] = carts.map((cart) => ({
    productId: cart.product.id,
    quantity: cart.quantity,
  }));

  return {
    order,
    products,
  };
};

export function dateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

export function calendarDateToDate(calendarDate: CalendarDate): Date {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
}

export const stringToTime = (timeString: string): Time => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Time(hours, minutes);
};

export const timeToString = (time: Time): string => {
  return `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const createUUID = () => {
  return uuidv4();
};
