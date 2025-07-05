import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { Command } from "@/features/student/command/components/command.tsx";
import PlayContainer from "@/features/student/game/components/play-container.tsx";
import { PlayDialog } from "@/features/student/game/components/play-dialog.tsx";

type PlayLevel = {
  level: string;
};

export const Route = createFileRoute("/_student/courses/_game/$course/play")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PlayLevel => {
    return {
      level: search.level as string,
    };
  },
});

function RouteComponent() {
  const sidebar = useSidebar();
  const [showCommand, setShowCommand] = useState(false);

  useEffect(() => {
    let cleanedUp = false;
    const sidebarEl = document.querySelector<HTMLElement>(".sidebar-root");

    const revealCommand = () => {
      if (!cleanedUp) setShowCommand(true);
    };

    const onTransitionEnd = () => {
      revealCommand();
      // remove the listener once it's fired
      (sidebarEl as EventTarget).removeEventListener(
        "transitionend",
        onTransitionEnd as EventListener,
      );
    };

    const collapseThenShow = () => {
      if (window.innerWidth < 1200 && sidebar.state === "expanded") {
        sidebar.toggleSidebar();
        if (sidebarEl) {
          // cast to EventTarget so TS lets us use "transitionend"
          (sidebarEl as EventTarget).addEventListener(
            "transitionend",
            onTransitionEnd as EventListener,
          );
        } else {
          // fallback after 300ms if the element isn't found
          setTimeout(revealCommand, 300);
        }
      } else {
        // already collapsed or wide viewport
        revealCommand();
      }
    };

    collapseThenShow();

    return () => {
      cleanedUp = true;
      if (sidebarEl) {
        (sidebarEl as EventTarget).removeEventListener(
          "transitionend",
          onTransitionEnd as EventListener,
        );
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="game-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <PlayDialog />
      <PlayContainer />
      {showCommand && <Command />}
    </div>
  );
}
