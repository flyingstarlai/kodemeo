import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthApiClient } from "@/lib/api.ts";
import type { AxiosError } from "axios";
import type { LoginPayload, LoginResponse } from "@/features/auth/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      getAuthApiClient()
        .post<LoginResponse>("/login/student", payload)
        .then((res) => res.data)
        .catch((err: unknown) => {
          if ((err as AxiosError)?.response?.status === 401) {
            throw new Error("Invalid username or password");
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
