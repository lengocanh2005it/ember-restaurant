import { UploadFileDto } from "@/api/files/utils/types";
import axios from "@/lib/axios";

export const handleUploadFiles = async (
  uploadFileDto: UploadFileDto
): Promise<any> => {
  const { file } = uploadFileDto;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
