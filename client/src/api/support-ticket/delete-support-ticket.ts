import { DeleteSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";

export const handleDeleteSupportTicket = async (
  deleteSupportTicketDto: DeleteSupportTicketDto
): Promise<any> => {
  try {
    const { requestId, userId } = deleteSupportTicketDto;

    const response = await axios.delete(
      `/support-ticket/${requestId}/?userId=${userId}`
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
