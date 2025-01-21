export type CreateAreaDto = {
  name: string;
  description?: string;
  capacity: number;
  floor_number: number;
  operating_hours: string;
};

export type UpdateAreaDto = {
  areaId: string;
  name: string;
  description: string;
  capacity: number;
  floor_number: number;
  operating_hours: string;
  is_full: boolean;
  status: string;
  tableIds: string[];
};
