import { UpdateSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";

export const handleUpdateSupportTicket = async (
  updateSupportTicketDto: UpdateSupportTicketDto
): Promise<any> => {
  try {
    const { requestId, type, ...res } = updateSupportTicketDto;

    const response = await axios.patch(
      `/support-ticket/${requestId}/?type=${type}`,
      res
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
