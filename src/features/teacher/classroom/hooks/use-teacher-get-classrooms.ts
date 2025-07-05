import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import { useQuery } from "@tanstack/react-query";
import type { Classroom } from "@/features/teacher/classroom/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

export function useTeacherGetClassrooms() {
  return useQuery<Classroom[], Error>({
    queryKey: queryKeys.classrooms,
    queryFn: () =>
      getTeacherApiClient()
        .get<Classroom[]>("/classrooms", withAuthConfig())
        .then((res) => res.data || []),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
