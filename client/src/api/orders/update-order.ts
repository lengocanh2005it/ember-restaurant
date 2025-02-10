import { UpdateOrderDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";

export const handleUpdateOrder = async (
  updateOrderDto: UpdateOrderDto
): Promise<any> => {
  try {
    const { id, ...res } = updateOrderDto;

    const response = await axios.patch(`/orders/${id}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
