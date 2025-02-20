import { handleSentOTPToEmail } from "@/api/users/send-otp-to-email";
import { useAppStore } from "@/store";
import { useMutation } from "@tanstack/react-query";

export const useSendOTP = () => {
  const { setOTP } = useAppStore();

  return useMutation({
    mutationFn: handleSentOTPToEmail,
    onSuccess: (data: any) => {
      if (data && data.message) {
        setOTP("");
      }
    },
    onError: (err: any) => {
      console.error(err);
    },
  });
};
