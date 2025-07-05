import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useTeacherGetCourses } from "@/features/teacher/courses/hooks/use-teacher-get-courses.ts";
import type { AssignCoursesData } from "@/features/teacher/courses/types.ts";
import { assignCoursesSchema } from "@/features/teacher/courses/schema.ts";
import { useTeacherAssignCourses } from "@/features/teacher/assignment/hooks/use-teacher-assign-course.ts";
import { AssignedCoursesTabs } from "@/features/teacher/assignment/components/assigned-courses-tabs.tsx";
import { getQueryDataByKey } from "@/lib/query-keys.ts";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import { useQueryClient } from "@tanstack/react-query";

export const AssignedCourseSection: React.FC = () => {
  const qc = useQueryClient();
  const { data: user } = useGetMe();

  const assignedCourses = getQueryDataByKey(
    qc,
    "assignedCourses",
    user?.classroomId ?? "",
  );

  const [open, setOpen] = useState(false);
  const { data: allCourses, isLoading, error } = useTeacherGetCourses();
  const assignCourse = useTeacherAssignCourses();

  const form = useForm<AssignCoursesData>({
    resolver: zodResolver(assignCoursesSchema),
    defaultValues: { courseIds: [] },
  });

  const onSubmit = async (values: AssignCoursesData) => {
    try {
      await assignCourse.mutateAsync(values.courseIds);
      console.log(values.courseIds);
      setOpen(false);
    } catch {
      // error
    }
  };

  // When dialog opens, pre-check courses already assigned
  useEffect(() => {
    if (assignedCourses) {
      const defaultIds = assignedCourses.map((c) => c.courseId);
      form.reset({ courseIds: defaultIds });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!assignedCourses) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Assigned Courses
        </h3>
        <Button onClick={() => setOpen(true)}>Assign Courses</Button>
      </div>

      <AssignedCoursesTabs assignedCourses={assignedCourses ?? []} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Assign Courses</DialogTitle>
            <DialogDescription>
              Select one or more courses to assign to this classroom.
            </DialogDescription>
          </DialogHeader>

          {isLoading && <p>Loading courses…</p>}
          {error && <p className="text-red-600">Error loading courses</p>}

          {allCourses && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-h-60 overflow-y-auto"
              >
                {allCourses.map((course) => (
                  <FormField
                    key={course.id}
                    control={form.control}
                    name="courseIds"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(course.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, course.id]);
                              } else {
                                field.onChange(
                                  field.value.filter((id) => id !== course.id),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel>{course.title}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="courseIds"
                  render={() => <FormMessage className="text-red-600 mt-2" />}
                />

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Assign</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
