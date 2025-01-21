import { CreateOrderDetailsDto } from "@/api/orders/utils/types";
import { StatusEnum } from "@/config/enums/enums";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateOrder = async (
  createOrderDetailsDto: CreateOrderDetailsDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const date = new Date().toISOString().split("T")[0];

    const {
      userId,
      total_price,
      delivery_address,
      delivery_method,
      payment_method,
      discountId,
      phone_number,
      note,
      promotionCode,
    } = createOrderDetailsDto.order;

    const order = {
      userId,
      date,
      total_price,
      status: StatusEnum.PENDING,
      delivery_address,
      delivery_method,
      payment_method,
      discountId,
      phone_number,
      note,
      promotionCode,
    };

    const data = {
      order,
      products: createOrderDetailsDto.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
      })),
    };

    const response = await axios.post(
      `/orders/?userId=${createOrderDetailsDto.userId}`,
      data,
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
