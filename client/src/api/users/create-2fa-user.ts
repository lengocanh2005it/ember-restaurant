import { Create2FADto } from "@/api/users/utils/types";
import axios from "@/lib/axios";

export const handleCreate2FAOfUser = async (
  create2FADto: Create2FADto
): Promise<any> => {
  try {
    const response = await axios.post("/auth/2fa", create2FADto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
