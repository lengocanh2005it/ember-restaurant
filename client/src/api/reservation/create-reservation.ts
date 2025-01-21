import { CreateReservationDto } from "@/api/reservation/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateReservation = async (
  createReservationDto: CreateReservationDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post(
      "/reservations/?option=current",
      createReservationDto,
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
