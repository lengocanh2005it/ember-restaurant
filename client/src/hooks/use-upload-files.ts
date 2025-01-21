import { handleUploadFiles } from "@/api/files/upload-files";
import { useMutation } from "@tanstack/react-query";

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: handleUploadFiles,
    onSuccess: (data: any) => {},
    onError: (err: any) => {
      console.error(err);
    },
  });
};
