import type {
  BeginResponse,
  ChallengeScore,
} from "@/features/dashboard/challenge/types";
import type { User } from "@/features/me/types.ts";

import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { AssignedCourse } from "@/features/dashboard/course/types.ts";
import type { RoomLogin } from "@/features/auth/types.ts";

export const queryKeys = {
  user: ["user"] as const,
  roomLogin: ["roomLogin"] as const,
  // Student-specific
  assignedCourses: (id: string) =>
    ["classroom", id, "assignedCourses"] as const,
  challengeScores: (classroomId: string, assignedCourseId: string) =>
    ["dashboard", "assignments", classroomId, assignedCourseId] as const,
  challengeBegin: (
    classroomId: string,
    assignedCourseId: string,
    challengeId: string,
  ) =>
    [
      "dashboard",
      "assignments",
      classroomId,
      assignedCourseId,
      "challengeBegin",
      challengeId,
    ] as const,
};

export type QueryDataMap = {
  user: User;
  roomLogin: RoomLogin[];
  assignedCourses: AssignedCourse[];
  challengeScores: ChallengeScore[];
  challengeBegin: BeginResponse;
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
