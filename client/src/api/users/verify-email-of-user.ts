import { VerifyEmailDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";

export const handleVerifyEmail = async (
  verifyEmailDto: VerifyEmailDto
): Promise<any> => {
  try {
    const response = await axios.post("/auth/verify-email", verifyEmailDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
