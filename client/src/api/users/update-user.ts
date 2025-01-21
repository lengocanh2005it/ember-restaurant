import { handleUploadFiles } from "@/api/files/upload-files";
import { UpdateUserDto } from "@/api/users/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateUser = async (
  updateUserDto: UpdateUserDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { userId, image, ...res } = updateUserDto;

    let data = null;

    if (image) {
      const imageResponseUrl = await handleUploadFiles({
        file: image,
      });

      if (imageResponseUrl && imageResponseUrl.data) {
        data = {
          ...res,
          image: imageResponseUrl?.data.url,
        };
      } else {
        throw new Error("Internal Server Error!");
      }
    } else {
      data = res;
    }

    const response = await axios.patch(`/users/${userId}`, data, {
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
