import { UpdateOrderDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateOrder = async (
  updateOrderDto: UpdateOrderDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { id, ...res } = updateOrderDto;

    const response = await axios.patch(`/orders/${id}`, res, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
