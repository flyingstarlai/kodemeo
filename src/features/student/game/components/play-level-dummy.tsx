import React, { useMemo } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { QueryStatus } from "@/components/query-status.tsx";
import type { StudentChallengeResponse } from "@/features/teacher/assignment/types.ts";
import { useStudentCompleteChallenge } from "@/features/student/challenge/hooks/use-student-complete-challenge.ts";
import { getQueryDataByKey, queryKeys } from "@/lib/query-keys.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useStudentsGetChallenges } from "@/features/student/challenge/hooks/use-student-get-challenges.ts";
import { useStudentBeginChallenge } from "@/features/student/challenge/hooks/use-student-begin-challenge.ts";

export const PlayLevelDummy: React.FC = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { course: courseSlug } = useParams({
    strict: false,
  });
  const { level: challengeId } = useSearch({ strict: false });

  // Fetch challenges data for this course
  const {
    data: challenges,
    isLoading,
    error,
  } = useStudentsGetChallenges(courseSlug);

  const completeMutation = useStudentCompleteChallenge(courseSlug);
  const beginMutation = useStudentBeginChallenge(courseSlug ?? "");

  const user = getQueryDataByKey(qc, "user");

  const beginData = getQueryDataByKey(
    qc,
    "studentChallengeBegin",
    user?.classroomId,
    courseSlug,
    challengeId,
  );

  // Find this specific challenge
  const challenge = useMemo<StudentChallengeResponse | undefined>(
    () => challenges?.find((c) => c.challengeId === challengeId),
    [challenges, challengeId],
  );

  // Guard: must have begun the challenge

  if (isLoading || error) {
    return <QueryStatus isLoading={isLoading} error={error} />;
  }

  if (!challenge) {
    return <p className="text-red-600">Challenge not found.</p>;
  }

  if (challenge.isLocked) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-600 mb-4">
          This challenge is locked and cannot be played yet.
        </p>
        <Button
          onClick={() =>
            navigate({
              to: "/courses/$course",
              params: { course: courseSlug! },
              search: { page: 1 },
            })
          }
        >
          Back to Course
        </Button>
      </div>
    );
  }

  if (!beginData && !beginMutation.isPending) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-600 mb-4">Session expired for this level.</p>
        <Button
          onClick={() =>
            navigate({
              to: "/courses/$course",
              params: { course: courseSlug! },
              search: { page: 1 },
            })
          }
        >
          Back to Course
        </Button>
      </div>
    );
  }
  const handleComplete = async () => {
    if (!beginData) return;
    const { token, timestamp } = beginData;

    try {
      // complete current challenge
      await completeMutation.mutateAsync({
        challengeId: challenge.challengeId,
        stars: 3,
        token,
        timestamp,
      });

      // clear begin cache for this level
      qc.removeQueries({
        queryKey: queryKeys.studentChallengeBegin(
          user!.classroomId!,
          courseSlug!,
          challengeId!,
        ),
      });

      // find next challenge
      const idx = challenges!.findIndex((c) => c.challengeId === challengeId);
      const next = challenges![idx + 1];

      console.log("next", next.challengeId);

      if (next) {
        // begin next challenge
        await beginMutation.mutateAsync({
          challengeId: next.challengeId,
        });
        await navigate({
          to: "/courses/$course/play",
          params: { course: courseSlug! },
          search: {
            level: next.challengeId,
          },
        });
      } else {
        // no more levels
        await navigate({
          to: "/courses/$course",
          params: { course: courseSlug! },
          search: { page: 1 },
        });
      }
    } catch (err) {
      console.error("Error completing challenge:", err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
          <p>Level: {challenge.level}</p>
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < challenge.stars ? "text-yellow-400" : "text-zinc-300"
                }
              >
                ★
              </span>
            ))}
          </div>
          {challenge.isLocked && (
            <p className="text-red-600">This challenge is locked.</p>
          )}
          <div className="space-x-4">
            <Button
              onClick={handleComplete}
              disabled={challenge.isLocked || completeMutation.isPending}
            >
              {completeMutation.isPending
                ? "Completing…"
                : challenge.isLocked
                  ? "Locked"
                  : "Complete Level"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
