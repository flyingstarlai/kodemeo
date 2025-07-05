import { Check, ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button.tsx";
import { IconDeviceGamepad3, IconPlus } from "@tabler/icons-react";
import { useUpdateMe } from "@/features/me/hooks/use-update-me.ts";
import type { User } from "@/features/me/types.ts";
import type { Classroom } from "@/features/teacher/classroom/types.ts";

export function ClassroomSwitcher({
  rooms,
  onCreate,
}: {
  rooms: Classroom[];
  onCreate: () => void;
}) {
  const updateUser = useUpdateMe();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(["user"]);
  const classroom = rooms.find((r) => r.id === user?.classroomId);
  const [selectedRoom, setSelectedRoom] = useState<Classroom | undefined>(
    classroom,
  );

  useEffect(() => {
    if (classroom) {
      setSelectedRoom(classroom);
    }
  }, [classroom]);

  const handleSelect = (room: Classroom) => {
    setSelectedRoom(room);
    updateUser.mutate({ defaultClassroomId: room.id });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <IconDeviceGamepad3 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Classroom</span>
                <span className="">{selectedRoom?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {rooms.map((room) => (
              <DropdownMenuItem
                key={room.id}
                onSelect={() => handleSelect(room)}
              >
                {room.name}
                {room === selectedRoom && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
            {/* Separator */}
            <DropdownMenuSeparator />

            {/* “Add New” button */}
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreate}
                className="w-full justify-start"
              >
                <IconPlus className="mr-2 size-4" />
                Add New Classroom
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
