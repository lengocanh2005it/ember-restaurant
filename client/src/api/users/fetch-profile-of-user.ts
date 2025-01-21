import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchProfileOfUser = async () => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    return response.data.data;
  } catch (err) {
    console.error(err);
  }
};
