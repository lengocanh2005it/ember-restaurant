import { Confirm2FADto } from "@/api/users/utils/types";
import axios from "@/lib/axios";

export const handleConfirm2FA = async (
  confirm2FADto: Confirm2FADto
): Promise<any> => {
  try {
    const response = await axios.post("/auth/confirm/2fa", confirm2FADto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
