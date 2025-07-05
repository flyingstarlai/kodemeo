import type { User } from "@/features/me/types.ts";
import type {
  AssignedCourseForStudent,
  Classroom,
  ClassroomDetail,
} from "@/features/teacher/classroom/types.ts";
import type { Course } from "@/features/teacher/courses/hooks/use-teacher-get-courses.ts";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { Enrollment } from "@/features/teacher/enrollment/types.ts";
import type {
  AssignedCourse,
  BeginResponse,
  StudentChallengeScore,
  StudentScoresResponse,
} from "@/features/teacher/assignment/types.ts";

export const queryKeys = {
  user: ["user"] as const,
  classrooms: ["classrooms"] as const,
  courses: ["courses"] as const,
  course: (id: string) => ["course", id] as const,

  classroom: (id: string) => ["classroom", id] as const,
  enrollments: (id: string) => ["enrollments", id] as const,
  assignedCourses: (id: string) =>
    ["classroom", id, "assignedCourses"] as const,

  // Student-specific
  studentAssignedCourses: (id: string) =>
    ["classroom", id, "studentAssignedCourses"] as const,
  studentChallengeScores: (classroomId: string, assignedCourseId: string) =>
    ["student", "assignments", classroomId, assignedCourseId] as const,
  studentChallengeBegin: (
    classroomId: string,
    assignedCourseId: string,
    challengeId: string,
  ) =>
    [
      "student",
      "assignments",
      classroomId,
      assignedCourseId,
      "challengeBegin",
      challengeId,
    ] as const,

  // Teacher-specific
  teacherAssignmentScores: (classroomId: string, courseSlug: string) =>
    ["teacher", "assignments", classroomId, courseSlug] as const,
};

export type QueryDataMap = {
  user: User;
  classrooms: Classroom[];
  courses: Course[];
  course: Course;
  classroom: ClassroomDetail;
  enrollments: Enrollment[];
  assignedCourses: AssignedCourse[];

  // Student-specific data
  studentAssignedCourses: AssignedCourseForStudent[];
  studentChallengeScores: StudentChallengeScore[];
  studentChallengeBegin: BeginResponse;

  // Teacher-specific data
  teacherAssignmentScores: StudentScoresResponse[];
};

export function getQueryDataByKey<K extends keyof QueryDataMap>(
  qc: QueryClient,
  key: K,
  ...ids: (string | undefined | null)[]
): QueryDataMap[K] | undefined {
  const builder = queryKeys[key] as
    | readonly unknown[]
    | ((...args: string[]) => readonly unknown[]);

  let fullKey: readonly unknown[];
  if (typeof builder === "function") {
    // all IDs must be present
    if (ids.some((id) => !id)) return undefined;
    fullKey = builder(...(ids as string[]));
  } else {
    fullKey = builder;
  }

  return qc.getQueryData<QueryDataMap[K]>(fullKey as QueryKey);
}

/**
 * Invalidate a cache entry by key, without forcing non‐null IDs.
 */
export function invalidateQueryByKey<K extends keyof QueryDataMap>(
  qc: QueryClient,
  key: K,
  ...ids: (string | undefined)[]
): void {
  const builder = queryKeys[key] as
    | readonly unknown[]
    | ((...args: string[]) => readonly unknown[]);

  let fullKey: readonly unknown[];
  if (typeof builder === "function") {
    if (ids.some((id) => !id)) return;
    fullKey = builder(...(ids as string[]));
  } else {
    fullKey = builder;
  }

  qc.invalidateQueries({ queryKey: fullKey as QueryKey }).catch(() => {});
}
