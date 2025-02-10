import { handleUploadFiles } from "@/api/files/upload-files";
import { UpdateNotificationDto } from "@/api/notifications/utils/types";
import axios from "@/lib/axios";

export const handleUpdateNotification = async (
  updateNotificationDto: UpdateNotificationDto
): Promise<any> => {
  try {
    const { notificationId, image, ...res } = updateNotificationDto;

    let data = null;

    if (image) {
      const imageUrlResponse = await handleUploadFiles({
        file: image,
      });

      if (imageUrlResponse && imageUrlResponse.data) {
        data = {
          ...res,
          image: imageUrlResponse.data.url as string,
        };
      }
    } else {
      data = res;
    }

    const response = await axios.patch(
      `/notifications/${notificationId}`,
      data
    );

    if (!response.data) throw new Error("Internal Server Error.");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
