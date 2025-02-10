import { handleUploadFiles } from "@/api/files/upload-files";
import { CreatePromotionDto } from "@/api/promotions/utils/types";
import axios from "@/lib/axios";

export const handleCreatePromotion = async (
  createPromotionDto: CreatePromotionDto
): Promise<any> => {
  try {
    const { image, ...res } = createPromotionDto;

    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (imageUrlResponse) {
      const data = {
        ...res,
        image: imageUrlResponse.url as string,
      };

      const response = await axios.post("/promotions", data);

      if (!response.data) throw new Error("Internal Server Error!");

      return response.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
