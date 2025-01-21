import { handleUpdateProfileOfUser } from "@/api/users/update-profile-of-user";
import { useUserStore } from "@/store";
import { User } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: handleUpdateProfileOfUser,
    onSuccess: (data: any) => {
      queryClient.setQueryData(["profile"], data);
      setUser(data as User);
      toast.success("Save profile successfully!", {
        position: "bottom-right",
        autoClose: 3000,
        style: { backgroundColor: "#fff", color: "#000", fontSize: "16px" },
      });
    },
    onError: (error: any) => {
      console.error(error);

      toast.error(error.response.data.message, {
        position: "bottom-right",
        autoClose: 3000,
        style: { backgroundColor: "#dc3545", color: "#fff", fontSize: "16px" },
      });
    },
  });
};

export default useUpdateProfile;
