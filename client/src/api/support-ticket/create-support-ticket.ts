import { CreateSupportTicketDto } from "@/api/support-ticket/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateSupportTicket = async (
  createSupportTicketDto: CreateSupportTicketDto
) => {
  try {
    const accessToken = await getValidAccessToken();

    const { userId, request } = createSupportTicketDto;

    const response = await axios.post(
      `/support-ticket`,
      {
        userId,
        original_request: request,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Internal Server Error!");

    console.log(response.data.data);

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
