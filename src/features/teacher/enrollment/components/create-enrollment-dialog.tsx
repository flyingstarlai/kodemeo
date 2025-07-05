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
import { Input } from "@/components/ui/input.tsx";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { generatePassword } from "@/lib/utils.ts";
import type { CreateEnrollmentData } from "@/features/teacher/enrollment/types.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEnrollmentSchema } from "@/features/teacher/enrollment/schema.ts";
import { useTeacherCreateEnrollment } from "@/features/teacher/enrollment/hooks/use-teacher-create-enrollment.ts";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryDataByKey } from "@/lib/query-keys.ts";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";

interface CreateEnrollmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreateEnrollmentDialog: React.FC<CreateEnrollmentDialogProps> = ({
  open,
  setOpen,
}) => {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;
  const createMutation = useTeacherCreateEnrollment();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<CreateEnrollmentData>({
    resolver: zodResolver(createEnrollmentSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  const handleGenerate = () => {
    const pw = generatePassword(12);
    form.setValue("password", pw);
    setShowPassword(true);
  };

  const onAddStudent = (data: CreateEnrollmentData) => {
    if (!classroomId) return;
    createMutation.mutate(
      { ...data, classroomId },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Provide name, username, and password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAddStudent)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <IconEyeOff className="size-4" />
                      ) : (
                        <IconEye className="size-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                    >
                      Generate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Adding…" : "Add Student"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
