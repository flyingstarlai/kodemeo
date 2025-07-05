import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBaseApiClient, withAuthConfig } from "@/lib/api.ts";
import type { User } from "@/features/me/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

/**
 * Fetch the full me record from the server by ID, using the cached 'me' for the ID and initial data.
 * GET /api/me/:id
 */
export function useGetMe() {
  const queryClient = useQueryClient();
  // Attempt to read the current me from cache (e.g. after login or /me)
  const cachedUser = queryClient.getQueryData<User>(["user"]);
  const userId = cachedUser?.id;

  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: () =>
      getBaseApiClient()
        .get<User>(`/api/me`, withAuthConfig())
        .then((res) => res.data),
    // Only run if we have an ID
    enabled: !!userId,
    // Use the cached me as initial data until the request completes
    initialData: cachedUser,
    staleTime: 0,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
