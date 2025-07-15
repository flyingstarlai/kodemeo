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
import sequenceImage from "@/assets/course/sequence.png";
import loopImage from "@/assets/course/loop.png";

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

  const getImage = (slug: string) => {
    if (slug === "sequence") {
      return sequenceImage;
    } else if (slug === "loop") {
      return loopImage;
    }

    return sequenceImage;
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="flex flex-col h-full">
          <img
            src={getImage(course.slug)}
            alt="Course poster"
            className="rounded-md mb-3 w-full object-cover max-h-100"
          />
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600 flex-grow">{course.description}</p>

          <p className="text-sm mt-2 italic text-gray-400 font-bold">
            {course.isEnrolled ? "Terdaftar" : "Belum terdaftar"}
          </p>
          <Button
            onClick={handleAction}
            disabled={enrollMutation.isPending}
            className="mt-4 w-full"
            variant={course.isEnrolled ? "outline" : "default"}
          >
            {enrollMutation.isPending
              ? course.isEnrolled
                ? "Melanjutkan…"
                : "Memulai…"
              : course.isEnrolled
                ? "Lanjutkan"
                : "Mulai Kelas"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>
              Apakah kamu ingin memulai kelas "{course.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                handleEnroll();
                setConfirmOpen(false);
              }}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Memulai…" : "Mulai"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
