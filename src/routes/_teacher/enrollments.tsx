import { createFileRoute } from "@tanstack/react-router";
import { EnrollmentSection } from "@/features/teacher/enrollment/components/enrollment-section.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useTeacherGetClassrooms } from "@/features/teacher/classroom/hooks/use-teacher-get-classrooms.ts";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";

export const Route = createFileRoute("/_teacher/enrollments")({
  component: RouteComponent,
});

function RouteComponent() {
  const [copied, setCopied] = useState(false);
  const { data: user } = useGetMe();

  const { data: classrooms } = useTeacherGetClassrooms();
  const classroom = classrooms?.find((cr) => cr.id === user?.classroomId);

  if (!classrooms) return <p className="p-6">Loading classroom...</p>;
  if (!classroom) return null;

  const loginUrl = `${window.location.origin}/student/login?room=${classroom.code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(loginUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
  return (
    <div className="flex flex-1 flex-col p-6 space-y-8">
      <Card className="max-w-lg mt-4">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">Student Login Link</h2>
          <div className="flex gap-2">
            <Input
              readOnly
              value={loginUrl}
              className="flex-1"
              onFocus={(e) => e.target.select()}
            />
            <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Classroom Info */}
      <EnrollmentSection />
    </div>
  );
}
