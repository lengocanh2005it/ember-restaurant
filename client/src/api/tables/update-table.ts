import { UpdateTableDto } from "@/api/tables/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUpdateTable = async (
  updateTableDto: UpdateTableDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { tableId, ...res } = updateTableDto;

    const response = await axios.patch(`/tables/${tableId}`, res, {
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
