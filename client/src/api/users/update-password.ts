import { UpdatePasswordDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";

export const handleUpdatePasswordOfUser = async (
  updatePasswordDto: UpdatePasswordDto
): Promise<any> => {
  try {
    const response = await axios.post(
      "/auth/update-password",
      updatePasswordDto
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
