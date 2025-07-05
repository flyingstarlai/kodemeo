import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthApiClient, withAuthConfig } from "@/lib/api.ts";
import type { AuthResponse, RegisterPayload } from "@/features/auth/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, RegisterPayload>({
    mutationFn: (payload) =>
      getAuthApiClient()
        .post<AuthResponse>("/register", payload, withAuthConfig())
        .then((res) => res.data),

    onSuccess: ({ token, ...user }) => {
      queryClient.setQueryData(queryKeys.user, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.user }).catch();
      localStorage.setItem("token", token);
    },
  });
}
