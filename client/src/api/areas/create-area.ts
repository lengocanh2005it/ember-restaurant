import { CreateAreaDto } from "@/api/areas/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";
import { AxiosResponse } from "axios";

export const handleCreateArea = async (
  createAreaDto: CreateAreaDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post("areas", createAreaDto, {
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
