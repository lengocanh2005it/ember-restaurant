import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleFetchRolesOfUser = async (): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get("/auth/role", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    if (!response.data) throw new Error("Internal Server Error");

    return response;
  } catch (err) {
    console.error(err);
  }
};
