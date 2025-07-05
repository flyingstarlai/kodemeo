import { useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { useStudentCompleteChallenge } from "@/features/student/challenge/hooks/use-student-complete-challenge";
import { useStudentBeginChallenge } from "@/features/student/challenge/hooks/use-student-begin-challenge";
import { getQueryDataByKey, queryKeys } from "@/lib/query-keys";
import { useDialogStore } from "@/stores/use-dialog-store";

export function useCompleteLevel() {
  const qc = useQueryClient();
  const { course: courseSlug } = useParams({ strict: false });
  const { level: challengeId } = useSearch({ strict: false });

  const completeMutation = useStudentCompleteChallenge(courseSlug ?? "");
  const beginMutation = useStudentBeginChallenge(courseSlug ?? "");
  const openDialog = useDialogStore((s) => s.openDialog);

  const completeAndAdvance = async (stars: number) => {
    const user = getQueryDataByKey(qc, "user");
    const beginData = getQueryDataByKey(
      qc,
      "studentChallengeBegin",
      user?.classroomId,
      courseSlug,
      challengeId,
    );

    if (!beginData) {
      openDialog({
        title: "Session Expired",
        message: "Please restart this level.",
      });
      return;
    }

    try {
      // 1. Complete challenge
      await completeMutation.mutateAsync({
        challengeId: challengeId!,
        stars,
        token: beginData.token,
        timestamp: beginData.timestamp,
      });

      // 2. Remove cache
      qc.removeQueries({
        queryKey: queryKeys.studentChallengeBegin(
          user!.classroomId!,
          courseSlug!,
          challengeId!,
        ),
      });

      if (stars > 0) {
        openDialog({
          title: "Well Done!",
          message: "Keep up the great work!",
          showStar: true,
        });
      }
    } catch {
      openDialog({
        title: "Session Expired",
        message: "Please restart to try again.",
        showStar: false,
      });

      return;
    }
  };

  return {
    completeAndAdvance,
    isPending: completeMutation.isPending || beginMutation.isPending,
    error: completeMutation.error || beginMutation.error,
  };
}
