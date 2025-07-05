import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthApiClient } from "@/lib/api.ts";
import type { AxiosError } from "axios";
import type {
  StudentLoginPayload,
  StudentLoginResponse,
} from "@/features/auth/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useLoginStudent() {
  const queryClient = useQueryClient();
  return useMutation<StudentLoginResponse, Error, StudentLoginPayload>({
    mutationFn: (payload) =>
      getAuthApiClient()
        .post<StudentLoginResponse>("/login/student", payload)
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
