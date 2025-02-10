import { UpdateCartDto } from "@/api/carts/utils/types";
import axios from "@/lib/axios";

export const handleUpdateCart = async (
  updateCartDto: UpdateCartDto
): Promise<any> => {
  try {
    const { cartId, userId, ...res } = updateCartDto;

    const response = await axios.patch(
      `/carts/${cartId}/?userId=${userId}`,
      res
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
