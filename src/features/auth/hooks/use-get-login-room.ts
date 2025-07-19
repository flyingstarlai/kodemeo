import { useQuery } from "@tanstack/react-query";
import { getAuthApiClient, withAuthConfig } from "@/lib/api.ts";
import type { RoomLogin } from "@/features/auth/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useGetLoginRoom(code?: string) {
  return useQuery<RoomLogin[], Error>({
    queryKey: queryKeys.roomLogin,
    queryFn: () =>
      getAuthApiClient()
        .get(`/login/room?code=${code}`, withAuthConfig())
        .then((res) => res.data),
    // Only run if we have an ID
    enabled: !!code,
    // Use the cached me as initial data until the request completes
    staleTime: 0,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
