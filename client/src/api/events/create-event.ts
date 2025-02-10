import { CreateEventDto } from "@/api/events/utils/types";
import { handleUploadFiles } from "@/api/files/upload-files";
import axios from "@/lib/axios";

export const handleCreateEvent = async (
  createEventDto: CreateEventDto
): Promise<any> => {
  try {
    const { image, ...res } = createEventDto;

    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (imageUrlResponse) {
      const data = {
        ...res,
        status: res.start_date >= new Date() ? "ongoing" : "scheduled",
        image: imageUrlResponse.url as string,
      };

      const response = await axios.post("/events", data);

      if (!response.data) throw new Error("Internal Server Error!");

      return response.data.data;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
