import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchDiscountOfUser = async (userId: string) => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(`/users/${userId}/?discounts=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
