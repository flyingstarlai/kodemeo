import React, { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useTeacherGetEnrollments } from "@/features/teacher/enrollment/hooks/use-teacher-get-enrollments.ts";

import { DataTable } from "@/features/teacher/enrollment/components/data-table.tsx";
import { columns } from "@/features/teacher/enrollment/components/columns.tsx";
import { CreateEnrollmentDialog } from "@/features/teacher/enrollment/components/create-enrollment-dialog.tsx";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import { CreateBulkEnrollmentsDialog } from "@/features/teacher/enrollment/components/create-bulk-enrollments-dialog.tsx";

export const EnrollmentSection: React.FC = () => {
  const { data: user } = useGetMe();

  const {
    data: enrollments,
    isLoading,
    error,
  } = useTeacherGetEnrollments(user?.classroomId ?? "");

  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 space-x-2">
        <h4 className="text-xl font-semibold">Enrollments</h4>
        <div className="space-x-6">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            Import Students
          </Button>
          <Button onClick={() => setOpen(true)}>Add Student</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading enrollments…</p>
      ) : error ? (
        <p className="text-red-600">Error loading enrollments</p>
      ) : (
        <DataTable columns={columns} data={enrollments ?? []} />
      )}

      <CreateEnrollmentDialog open={open} setOpen={setOpen} />
      <CreateBulkEnrollmentsDialog
        open={bulkOpen}
        setOpen={setBulkOpen}
        classroomId={user?.classroomId}
      />
    </div>
  );
};
