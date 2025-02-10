import { CreateReservationDto } from "@/api/reservation/utils/types";
import axios from "@/lib/axios";

export const handleCreateReservation = async (
  createReservationDto: CreateReservationDto
): Promise<any> => {
  try {
    const response = await axios.post(
      "/reservations/?option=current",
      createReservationDto
    );

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
