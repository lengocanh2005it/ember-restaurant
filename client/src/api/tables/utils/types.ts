export type CreateTableDto = {
  name: string;
  price: number;
  note?: string;
  areaId: string;
  capacity: number;
  type: string;
};

export type FetchTablesWithTypesDto = {
  type?: string;
  areaId: string;
};

export type UpdateTableDto = {
  tableId: string;
  areaId: string;
  name: string;
  capacity: number;
  price: number;
  note?: string;
  type: string;
  status: string;
  is_reserved: boolean;
};
