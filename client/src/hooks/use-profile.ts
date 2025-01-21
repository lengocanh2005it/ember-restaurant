import { handleFetchProfileOfUser } from "@/api/users/fetch-profile-of-user";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: handleFetchProfileOfUser,
    staleTime: 60 * 1000 * 20,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
