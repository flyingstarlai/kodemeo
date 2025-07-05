import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import type {
  Classroom,
  CreateClassroomPayload,
} from "@/features/teacher/classroom/types.ts";
import { invalidateQueryByKey, queryKeys } from "@/lib/query-keys.ts";

export function useTeacherCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation<Classroom, Error, CreateClassroomPayload>({
    mutationFn: (data) =>
      getTeacherApiClient()
        .post<Classroom>("/classrooms", data, withAuthConfig())
        .then((res) => res.data),
    onSuccess: (newRoom) => {
      // Invalidate rooms list so it refetches
      invalidateQueryByKey(queryClient, "classroom", newRoom.id);
      // Optionally set cache for the new room
      queryClient.setQueryData(queryKeys.classroom(newRoom.id), newRoom);
    },
  });
}
