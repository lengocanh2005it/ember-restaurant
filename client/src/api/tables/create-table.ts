import { CreateTableDto } from "@/api/tables/utils/types";
import axios from "@/lib/axios";

export const handleCreateTable = async (
  createTableDto: CreateTableDto
): Promise<any> => {
  try {
    const response = await axios.post("tables", createTableDto);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
