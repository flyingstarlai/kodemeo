import type { ColumnDef } from "@tanstack/react-table";
import type { Enrollment } from "@/features/teacher/enrollment/types.ts";
import { formatDate } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: (info) => info.getValue() as string,
  },
  {
    accessorKey: "joinedAt",
    header: "Joined At",
    cell: (info) => {
      const value = info.getValue() as string | null;
      return value ? formatDate(value) : "N/A";
    },
  },
];
