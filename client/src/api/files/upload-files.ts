import { UploadFileDto } from "@/api/files/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleUploadFiles = async (
  uploadFileDto: UploadFileDto
): Promise<any> => {
  const { file } = uploadFileDto;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.post(`/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
