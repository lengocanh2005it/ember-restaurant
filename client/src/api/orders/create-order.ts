import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateOrder = async (
  createOrderDetailsDto: CreateOrderDetailsDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { order, products, userId } = createOrderDetailsDto;

    const data = {
      order,
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      })),
    };

    const response = await axios.post(`/orders/?userId=${userId}`, data, {
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
