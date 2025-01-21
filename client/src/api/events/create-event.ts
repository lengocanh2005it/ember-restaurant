import { CreateEventDto } from "@/api/events/utils/types";
import { handleUploadFiles } from "@/api/files/upload-files";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateEvent = async (
  createEventDto: CreateEventDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { image, ...res } = createEventDto;

    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (imageUrlResponse && imageUrlResponse.data) {
      const data = {
        ...res,
        status: res.start_date >= new Date() ? "ongoing" : "scheduled",
        image: imageUrlResponse.data.url as string,
      };

      const response = await axios.post("/events", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) throw new Error("Internal Server Error!");

      return response.data.data;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
