import { useQuery } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";

// 1) Define the shape of a Course as returned by the API
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
}

/**
 * Hook to fetch all courses from the server.
 * Path: GET /api/courses
 */
export function useTeacherGetCourses() {
  return useQuery<Course[], Error>({
    queryKey: ["courses"],
    queryFn: () =>
      getTeacherApiClient()
        .get<Course[]>("/courses", withAuthConfig())
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
