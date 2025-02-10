import { UpdateEventDto } from "@/api/events/utils/types";
import axios from "@/lib/axios";

export const handleUpdateEvent = async (
  updateEventDto: UpdateEventDto
): Promise<any> => {
  try {
    const { eventId, ...res } = updateEventDto;

    const response = await axios.patch(`/events/${eventId}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
