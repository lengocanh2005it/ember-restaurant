export type CreateSupportTicketDto = {
  request: string;
  userId: string;
};

export type DeleteSupportTicketDto = {
  userId: string;
  requestId: string;
};

export type UpdateSupportTicketDto = {
  requestId: string;
  userId: string;
  response?: string;
  status?: string;
  original_request: string;
  type: "user" | "admin";
};
