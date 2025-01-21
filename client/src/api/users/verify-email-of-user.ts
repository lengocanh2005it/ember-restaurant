import { VerifyEmailDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleVerifyEmail = async (
  verifyEmailDto: VerifyEmailDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post("/auth/verify-email", verifyEmailDto, {
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
