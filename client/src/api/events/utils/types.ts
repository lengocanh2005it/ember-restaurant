export type CreateEventDto = {
  title: string;
  start_date: Date;
  end_date: Date;
  guests_number: number;
  description: string;
  note?: string;
  image: File;
  type: string;
};

export type UpdateEventDto = {
  eventId: string;
  title: string;
  description: string;
  note?: string;
  start_date: Date;
  end_date: Date;
  guests_number: number;
  type: string;
  status: string;
};
