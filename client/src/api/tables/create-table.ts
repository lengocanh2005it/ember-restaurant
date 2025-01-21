import { CreateTableDto } from "@/api/tables/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreateTable = async (
  createTableDto: CreateTableDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post("tables", createTableDto, {
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
