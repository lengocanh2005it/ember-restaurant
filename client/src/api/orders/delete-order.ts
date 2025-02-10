import { DeleteOrderOptionsDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";

export const handleDeleteOrder = async (
  deleteOrderOptionsDto: DeleteOrderOptionsDto
) => {
  try {
    const { orderId, modeOption, userId } = deleteOrderOptionsDto;

    const response = await axios.delete(
      `/orders/${orderId}?delete=${modeOption}&userId=${userId}`
    );

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
