import { handleUploadFiles } from "@/api/files/upload-files";
import { CreateNotificationDto } from "@/api/notifications/utils/types";
import axios from "@/lib/axios";

export const handleCreateNotification = async (
  createNotificationDto: CreateNotificationDto
): Promise<any> => {
  try {
    const { image, ...res } = createNotificationDto;

    let data = null;

    if (image) {
      const imageUrlResponse = await handleUploadFiles({
        file: image,
      });

      if (imageUrlResponse) {
        data = {
          ...res,
          image: imageUrlResponse.url,
        };
      } else {
        throw new Error("Image not found.");
      }
    } else {
      data = res;
    }

    const response = await axios.post("/notifications", data);

    if (!response.data) throw new Error("Internal Server Error");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
