import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchOrder = async (orderId: string): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(`/orders/${orderId}`, {
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
