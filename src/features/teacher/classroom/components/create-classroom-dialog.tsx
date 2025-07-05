import { useQueryClient } from "@tanstack/react-query";
import { useTeacherCreateClassroom } from "@/features/teacher/classroom/hooks/use-teacher-create-classroom.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
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
import { Input } from "@/components/ui/input.tsx";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import type { User } from "@/features/me/types.ts";
import type { createRoomData } from "@/features/teacher/classroom/types.ts";
import { createRoomSchema } from "@/features/teacher/classroom/schema.ts";
import { queryKeys } from "@/lib/query-keys.ts";

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateClassroomDialog: React.FC<CreateRoomDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(queryKeys.user);
  const createRoom = useTeacherCreateClassroom();
  const { refetch: refetchUser } = useGetMe();

  const form = useForm<createRoomData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: createRoomData) => {
    try {
      await createRoom.mutateAsync({
        name: values.name,
      });
      // get me here
      await queryClient.invalidateQueries({ queryKey: queryKeys.user });
      await queryClient.invalidateQueries({ queryKey: queryKeys.classrooms });
      await refetchUser();

      onOpenChange(false);
      form.reset();
    } catch {
      // errors surface via FormMessage
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button hidden />
      </DialogTrigger>
      <DialogContent
        showCloseButton={!!user?.classroomId}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create Your First Classroom</DialogTitle>
          <DialogDescription>
            Enter a name for your classroom to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Classroom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={createRoom.isPending}
              className="w-full"
            >
              {createRoom.isPending ? "Creating..." : "Create Classroom"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
