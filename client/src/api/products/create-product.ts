import { handleUploadFiles } from "@/api/files/upload-files";
import { CreateProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleAddProduct = async (
  createProductDto: CreateProductDto
): Promise<any> => {
  const { image, ...res } = createProductDto;

  try {
    const accessToken = await getValidAccessToken();

    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (!imageUrlResponse) throw new Error("File is required.");

    const data = {
      ...res,
      image: imageUrlResponse?.data?.url,
    };

    const response = await axios.post("/products", data, {
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
