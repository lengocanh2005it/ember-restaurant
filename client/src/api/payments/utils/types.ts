import { CachedOrderData, CachedReservationData } from "@/utils/types";

export type CreatePaymentDto = {
  amount: number;
  source?: string;
  payment_method: string;
  type: string;
  userId: string;
  orderId?: string;
  reservationId?: string;
};

export type CreatePaymentDetailsDto = {
  payments: CreatePaymentDto;
  order?: CachedOrderData;
  reservation?: CachedReservationData;
};
