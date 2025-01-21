import { UpdateEventDto } from "@/api/events/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateEvent = async (
  updateEventDto: UpdateEventDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { eventId, ...res } = updateEventDto;

    const response = await axios.patch(`/events/${eventId}`, res, {
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
