import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchProducts = async (): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get("/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
