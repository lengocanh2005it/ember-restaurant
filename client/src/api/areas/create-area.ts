import { CreateAreaDto } from "@/api/areas/utils/types";
import axios from "@/lib/axios";

export const handleCreateArea = async (
  createAreaDto: CreateAreaDto
): Promise<any> => {
  try {
    const response = await axios.post("areas", createAreaDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
