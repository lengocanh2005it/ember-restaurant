export type CreateReservationDto = {
  userId: string;
  guests_count: number;
  payment_method: "card" | "cash";
  note?: string;
  discountId?: string;
  date_time: Date;
  areaId: string;
  tableIds: string[];
  promotionCode?: string;
  payment_method_id?: string;
  payment_description?: string;
};

export type DeleteReservationDto = {
  reservationId: string;
  userId: string;
};

export type UpdateReservationDto = {
  reservationId: string;
  date_time: Date;
  guests_count: number;
  payment_method: "card" | "cash";
  note?: string;
  userId: string;
  areaId: string;
  tableIds?: string[];
  promotionCode?: string;
  status: string;
  admin_message?: string;
};
