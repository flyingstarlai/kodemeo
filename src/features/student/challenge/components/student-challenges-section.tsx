import React from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { IconLock } from "@tabler/icons-react";
import { QueryStatus } from "@/components/query-status.tsx";
import { useStudentBeginChallenge } from "@/features/student/challenge/hooks/use-student-begin-challenge.ts";
import { useStudentsGetChallenges } from "@/features/student/challenge/hooks/use-student-get-challenges.ts";

export const StudentChallengesSection: React.FC = () => {
  const navigate = useNavigate();
  const { course: courseSlug } = useParams({
    strict: false,
  });

  const {
    data: challenges,
    isLoading,
    error,
  } = useStudentsGetChallenges(courseSlug);

  const beginMutation = useStudentBeginChallenge(courseSlug);

  if (isLoading || error) {
    return <QueryStatus isLoading={isLoading} error={error} />;
  }

  if (!challenges || challenges.length === 0) {
    return <p>No challenges available.</p>;
  }

  const handleStart = (challengeId: string, isLocked: boolean) => {
    if (isLocked) return;
    beginMutation.mutate(
      { challengeId },
      {
        onSuccess: async () => {
          await navigate({
            to: `/courses/$course/play`,
            params: { course: courseSlug! },
            search: { level: challengeId },
          });
        },
      },
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {challenges.map((c) => (
        <Card key={c.challengeId} className="relative">
          <CardContent className="flex flex-col h-full">
            <h4 className="text-lg font-semibold mb-2">{c.title}</h4>
            <div className="inset-0 py-8 flex items-center justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < c.stars
                      ? "text-3xl text-yellow-400/80"
                      : "text-3xl text-zinc-300/80"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            {c.isLocked && (
              <div className="inset-0 py-6 flex items-center justify-center">
                <IconLock className="size-10 text-zinc-300/80" />
              </div>
            )}
            <Button
              onClick={() => handleStart(c.challengeId, c.isLocked)}
              disabled={c.isLocked || beginMutation.isPending}
              className="mt-auto w-full"
            >
              {beginMutation.isPending
                ? "Starting…"
                : c.isLocked
                  ? "Locked"
                  : "Start"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
