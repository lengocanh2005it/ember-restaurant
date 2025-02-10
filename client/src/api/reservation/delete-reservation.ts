import { DeleteReservationDto } from "@/api/reservation/utils/types";
import axios from "@/lib/axios";

export const handleDeleteReservation = async (
  deleteReservationDto: DeleteReservationDto
): Promise<any> => {
  try {
    const { reservationId, userId } = deleteReservationDto;

    const response = await axios.delete(
      `/reservations/${reservationId}/?userId=${userId}`
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
