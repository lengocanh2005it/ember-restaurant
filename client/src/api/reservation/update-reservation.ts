import { UpdateReservationDto } from "@/api/reservation/utils/types";
import axios from "@/lib/axios";

export const handleUpdateReservation = async (
  updateReservationDto: UpdateReservationDto
): Promise<any> => {
  try {
    const { reservationId, ...res } = updateReservationDto;

    const response = await axios.patch(`/reservations/${reservationId}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
