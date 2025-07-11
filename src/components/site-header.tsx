import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Link,
  useLocation,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useGetChallenges } from "@/features/dashboard/challenge/hooks/use-get-challenges.ts";
import type { ChallengeResponse } from "@/features/dashboard/challenge/types.ts";
import { SoundToggle } from "@/components/sound-toggle.tsx";

export function SiteHeader() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const { course: courseSlug } = useParams({
    strict: false,
  });
  const { level: challengeId } = useSearch({ strict: false });

  const { data: challenges } = useGetChallenges(courseSlug);

  const challenge = useMemo<ChallengeResponse | undefined>(
    () => challenges?.find((c) => c.challengeId === challengeId),
    [challenges, challengeId],
  );

  // Format a segment for breadcrumb label
  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Build breadcrumbs array
  const crumbs = segments
    .filter((seg) => seg !== "r")
    .map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      // If segment matches assignmentId, show level
      if (segment === "playground") {
        return { href, label: `${challenge?.level} / ${challenges?.length}` };
      }

      return { href, label: formatLabel(segment) };
    });

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          {location.pathname.includes("playground") && <SoundToggle />}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
