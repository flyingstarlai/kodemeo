import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginResponse, RoomLoginPayload } from "@/features/auth/types.ts";
import { getAuthApiClient } from "@/lib/api.ts";
import type { AxiosError } from "axios";
import { queryKeys } from "@/lib/query-keys.ts";

export function useLoginRoom() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, RoomLoginPayload>({
    mutationFn: (payload) =>
      getAuthApiClient()
        .post("/login/room", payload)
        .then((res) => res.data)
        .catch((err: unknown) => {
          if ((err as AxiosError)?.response?.status === 401) {
            throw new Error("Invalid username or code");
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
