import axios from "@/lib/axios";
import { UpdateCartDto } from "@/api/carts/utils/types";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateCart = async (
  updateCartDto: UpdateCartDto
): Promise<any> => {
  try {
    const accessToken: string = await getValidAccessToken();

    const { cartId, userId, ...res } = updateCartDto;

    const response = await axios.patch(
      `/carts/${cartId}/?userId=${userId}`,
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
