import { UpdateSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateSupportTicket = async (
  updateSupportTicketDto: UpdateSupportTicketDto
): Promise<any> => {
  try {
    const { requestId, type, ...res } = updateSupportTicketDto;

    const accessToken = await getValidAccessToken();

    const response = await axios.patch(
      `/support-ticket/${requestId}/?type=${type}`,
      res,
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
