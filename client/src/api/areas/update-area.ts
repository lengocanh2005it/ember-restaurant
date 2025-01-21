import { UpdateAreaDto } from "@/api/areas/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateArea = async (
  updateAreaDto: UpdateAreaDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { areaId, ...res } = updateAreaDto;

    const response = await axios.patch(`/areas/${areaId}`, res, {
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
