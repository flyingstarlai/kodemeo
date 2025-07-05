import * as React from "react";
import {
  IconCat,
  IconDashboard,
  IconStack2,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Link } from "@tanstack/react-router";
import { ClassroomSwitcher } from "@/features/teacher/classroom/components/classroom-switcher.tsx";
import { useTeacherGetClassrooms } from "@/features/teacher/classroom/hooks/use-teacher-get-classrooms.ts";
import { useEffect, useMemo, useState } from "react";
import { CreateClassroomDialog } from "@/features/teacher/classroom/components/create-classroom-dialog.tsx";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import { useTeacherGetAssignedCourses } from "@/features/teacher/assignment/hooks/use-teacher-get-assigned-courses.ts";

const baseNav = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Enrollments", url: "/enrollments", icon: IconUsers },
  {
    title: "Assignments",
    url: "/assignments",
    icon: IconStack2,
    subItems: [] as { title: string; url: string }[],
  },
];

export function TeacherAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: rooms } = useTeacherGetClassrooms();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: user } = useGetMe();
  const { data: assignedCourses } = useTeacherGetAssignedCourses(
    user?.classroomId ?? "",
  );

  const navItems = useMemo(() => {
    return baseNav.map((item) => {
      if (item.url === "/assignments") {
        return {
          ...item,
          subItems:
            assignedCourses?.map((ac) => ({
              title: ac.course.title,
              url: `/assignments/${ac.course.slug}`,
            })) ?? [],
        };
      }
      return item;
    });
  }, [assignedCourses]);

  useEffect(() => {
    if (user && !user.classroomId) {
      setDialogOpen(true);
    }
  }, [user]);

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link to="/">
                  <IconCat className="!size-6" />
                  <span className="text-base font-semibold">Junior Coder.</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {rooms && (
                <ClassroomSwitcher
                  rooms={rooms}
                  onCreate={() => setDialogOpen(true)}
                />
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <CreateClassroomDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
