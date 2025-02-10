import { handleFetchProfileOfUser } from "@/api/users/fetch-profile-of-user";
import { CUSTOM_STALE_TIME } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: handleFetchProfileOfUser,
    staleTime: CUSTOM_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
