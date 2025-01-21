import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleReOrder = async (
  createOrderDetailsDto: CreateOrderDetailsDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { userId } = createOrderDetailsDto;

    const response = await axios.post(
      `/orders/?userId=${userId}`,
      createOrderDetailsDto,
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
  }
};
