import { handleUploadFiles } from "@/api/files/upload-files";
import { UpdateProfileOfUserDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateProfileOfUser = async (
  updateProfileOfUserDto: UpdateProfileOfUserDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { userId, image, ...res } = updateProfileOfUserDto;

    let data = res as any;

    if (image) {
      const imageUrlResponse = await handleUploadFiles({
        file: image,
      });

      if (imageUrlResponse && imageUrlResponse.data) {
        data = {
          ...res,
          image: imageUrlResponse.data.url,
        };
      }
    }

    const response = await axios.patch(`/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
