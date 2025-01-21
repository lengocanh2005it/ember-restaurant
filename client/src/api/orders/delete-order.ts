import { DeleteOrderOptionsDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleDeleteOrder = async (
  deleteOrderOptionsDto: DeleteOrderOptionsDto
) => {
  try {
    const accessToken = await getValidAccessToken();

    const { orderId, modeOption, userId } = deleteOrderOptionsDto;

    const response = await axios.delete(
      `/orders/${orderId}?delete=${modeOption}&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
