import { handleUploadFiles } from "@/api/files/upload-files";
import { CreateProductDto } from "@/api/products/utils/types";
import axios from "@/lib/axios";

export const handleAddProduct = async (
  createProductDto: CreateProductDto
): Promise<any> => {
  const { image, ...res } = createProductDto;

  try {
    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (!imageUrlResponse) throw new Error("File is required.");

    const data = {
      ...res,
      image: imageUrlResponse?.url,
    };

    const response = await axios.post("/products", data);

    if (!response.data) throw new Error("Internal Server Error!");

    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
