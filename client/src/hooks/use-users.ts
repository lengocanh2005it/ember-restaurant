import { handleFetchUsers } from "@/api/users/fetch-users";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: handleFetchUsers,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
