import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getBaseApiClient, withAuthConfig } from "@/lib/api.ts";
import type { User } from "@/features/me/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

/**
 * Payload for updating the current me. All fields optional.
 */
export interface UpdateUserPayload {
  name?: string;
  password?: string;
  defaultClassroomId?: string;
}

export function useUpdateMe() {
  const qc = useQueryClient();

  return useMutation<User, Error, UpdateUserPayload>({
    mutationFn: (data: UpdateUserPayload) =>
      getBaseApiClient()
        .put<User>(`/api/me`, data, withAuthConfig())
        .then((res) => res.data),
    onSuccess: (updatedUser) => {
      qc.setQueryData(queryKeys.user, updatedUser);
      qc.invalidateQueries({ queryKey: queryKeys.user }).catch();
    },
  });
}
