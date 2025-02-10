import { UpdateTableDto } from "@/api/tables/utils/types";
import axios from "@/lib/axios";

export const handleUpdateTable = async (
  updateTableDto: UpdateTableDto
): Promise<any> => {
  try {
    const { tableId, ...res } = updateTableDto;

    const response = await axios.patch(`/tables/${tableId}`, res);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
