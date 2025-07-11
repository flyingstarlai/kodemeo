import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { AssignedCourse } from "@/features/dashboard/course/types.ts";
import { useEnrollCourse } from "@/features/dashboard/course/hooks/use-enroll-course.ts";
import { useNavigate } from "@tanstack/react-router";

interface CourseItemProps {
  course: AssignedCourse;
}

export const CourseItem: React.FC<CourseItemProps> = ({ course }) => {
  const navigate = useNavigate();
  const enrollMutation = useEnrollCourse();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEnroll = () => {
    enrollMutation.mutate(
      { assignedCourseId: course.assignedCourseId },
      {
        onSuccess: async () => {
          await navigate({
            to: "/courses/$course",
            params: { course: course.slug },
            search: { page: 1 },
          });
        },
      },
    );
  };

  const handleAction = async () => {
    if (course.isEnrolled) {
      await navigate({
        to: "/courses/$course",
        params: { course: course.slug },
        search: { page: 1 },
      });
    } else {
      setConfirmOpen(true);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 flex-grow">{course.description}</p>
          <p className="text-sm mt-2">
            {course.isEnrolled ? "Enrolled" : "Not enrolled"}
          </p>
          <Button
            onClick={handleAction}
            disabled={enrollMutation.isPending}
            className="mt-4 w-full"
            variant={course.isEnrolled ? "outline" : "default"}
          >
            {enrollMutation.isPending
              ? course.isEnrolled
                ? "Continuing…"
                : "Enrolling…"
              : course.isEnrolled
                ? "Continue"
                : "Enroll Course"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Confirm Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to enroll in "{course.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEnroll();
                setConfirmOpen(false);
              }}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Enrolling…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
