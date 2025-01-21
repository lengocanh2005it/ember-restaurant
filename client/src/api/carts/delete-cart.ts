import { DeleteCartDto } from "@/api/carts/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleDeleteCartOfUser = async (
  deleteCartDto: DeleteCartDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { cartId, userId } = deleteCartDto;

    const response = await axios.delete(`/carts/${cartId}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
