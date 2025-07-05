import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthApiClient, withAuthConfig } from "@/lib/api.ts";
import type { AxiosError } from "axios";
import type { AuthResponse, LoginPayload } from "@/features/auth/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      getAuthApiClient()
        .post<AuthResponse>("/login", payload, withAuthConfig())
        .then((res) => res.data)
        .catch((err: unknown) => {
          if ((err as AxiosError)?.response?.status === 401) {
            throw new Error("Invalid email or password");
          }
          throw err;
        }),
    onSuccess: ({ token, ...user }) => {
      queryClient.setQueryData(queryKeys.user, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.user }).catch();
      localStorage.setItem("token", token);
    },
  });
}
