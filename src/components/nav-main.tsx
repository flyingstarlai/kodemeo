import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Collapsible } from "@radix-ui/react-collapsible";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    subItems?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <div className="mt-2"></div>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) =>
            !item.subItems?.length ? (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <Link to={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <Collapsible
                key={item.title}
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem key={item.title}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <Link to={item.url}>{item.title}</Link>
                      <PlusIcon className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <MinusIcon className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={sub.url}>{sub.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
