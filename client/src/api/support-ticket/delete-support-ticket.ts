import { DeleteSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleDeleteSupportTicket = async (
  deleteSupportTicketDto: DeleteSupportTicketDto
): Promise<any> => {
  try {
    const { requestId, userId } = deleteSupportTicketDto;

    const accessToken = await getValidAccessToken();

    const response = await axios.delete(
      `/support-ticket/${requestId}/?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
