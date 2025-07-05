import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button.tsx";
import { useTeacherBulkCreateEnrollments } from "@/features/teacher/enrollment/hooks/use-teacher-bulk-create-enrollments.ts";
import { IconFileUpload } from "@tabler/icons-react";
import StudentTemplate from "@/assets/student_template.xlsx?url";

// Zod schema for file input
const bulkSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file." }),
});
type BulkFormData = z.infer<typeof bulkSchema>;

interface CreateBulkEnrollmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classroomId?: string | null;
}

export const CreateBulkEnrollmentsDialog: React.FC<
  CreateBulkEnrollmentDialogProps
> = ({ open, setOpen, classroomId }) => {
  const form = useForm<BulkFormData>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { file: undefined },
  });

  const bulkMutation = useTeacherBulkCreateEnrollments();

  const onSubmit = async (values: BulkFormData) => {
    if (classroomId) {
      console.log("Values", values);
      await bulkMutation.mutateAsync({ file: values.file, classroomId });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Import Students</DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file containing student data.
          </DialogDescription>
          {/* Template download link */}
          <div className="mt-2 mb-4">
            <a
              href={StudentTemplate}
              download
              className="text-primary underline hover:text-primary/80"
            >
              Download excel template
            </a>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File xlsx</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        id="bulk-file-input"
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                      {/* styled label/button */}
                      <label
                        htmlFor="bulk-file-input"
                        className="inline-flex items-center space-x-2 cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-50"
                      >
                        <IconFileUpload className="size-5" />
                        <span>
                          {field.value ? field.value.name : "Choose file"}
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={bulkMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={bulkMutation.isPending}>
                {bulkMutation.isPending ? "Importing…" : "Import Students"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
