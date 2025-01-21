import { ConfirmUserDto } from "@/api/login/utils/types";
import axios from "@/lib/axios";

export const handleLogin = async (
  confirmUserDto: ConfirmUserDto
): Promise<any> => {
  try {
    const response = await axios.post("/auth/login", confirmUserDto, {
      withCredentials: true,
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
