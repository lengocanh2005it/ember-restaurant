import { handleUploadFiles } from "@/api/files/upload-files";
import { CreatePromotionDto } from "@/api/promotions/utils/types";
import axios from "@/lib/axios";
import { getValidAccessToken } from "@/lib/token";

export const handleCreatePromotion = async (
  createPromotionDto: CreatePromotionDto
): Promise<any> => {
  try {
    const accessToken = await getValidAccessToken();

    const { image, ...res } = createPromotionDto;

    const imageUrlResponse = await handleUploadFiles({
      file: image,
    });

    if (imageUrlResponse && imageUrlResponse.data.url) {
      const data = {
        ...res,
        image: imageUrlResponse.data.url as string,
      };

      const response = await axios.post("/promotions", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) throw new Error("Internal Server Error!");

      return response.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};
