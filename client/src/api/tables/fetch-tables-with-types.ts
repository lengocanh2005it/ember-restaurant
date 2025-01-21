import { FetchTablesWithTypesDto } from "@/api/tables/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const fetchTablesByTypes = async (
  fetchTablesWithTypesDto: FetchTablesWithTypesDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { type, areaId } = fetchTablesWithTypesDto;

    const response = await axios.get(`/tables/?type=${type}&areaId=${areaId}`, {
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
