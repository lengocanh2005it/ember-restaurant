import { UpdateEmailOfUserDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateEmail = async (
  updateEmailOfUserDto: UpdateEmailOfUserDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { options, ...res } = updateEmailOfUserDto;

    const response = await axios.post(
      `/auth/update-email/?options=${options}`,
      res,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
