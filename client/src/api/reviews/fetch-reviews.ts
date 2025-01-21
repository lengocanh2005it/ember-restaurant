import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchReviews = async (isFeatured: string): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get(`/reviews/?featured=${isFeatured}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error.");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
