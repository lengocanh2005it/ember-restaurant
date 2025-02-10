import { UpdateAreaDto } from "@/api/areas/utils/types";
import axios from "@/lib/axios";

export const handleUpdateArea = async (
  updateAreaDto: UpdateAreaDto
): Promise<any> => {
  try {
    const { areaId, ...res } = updateAreaDto;

    const response = await axios.patch(`/areas/${areaId}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
