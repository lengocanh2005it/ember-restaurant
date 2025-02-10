import { CreateSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";

export const handleCreateSupportTicket = async (
  createSupportTicketDto: CreateSupportTicketDto
) => {
  try {
    const { userId, request } = createSupportTicketDto;

    const response = await axios.post(`/support-ticket`, {
      userId,
      original_request: request,
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
