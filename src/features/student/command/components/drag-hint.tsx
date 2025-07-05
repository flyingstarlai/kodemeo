import React, { useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import type {
  IBaseCommand,
  IWorkspaceItem,
} from "@/features/student/command/types.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { BaseCommand } from "@/features/student/command/components/base-command.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";

interface DragHintProps {
  paletteRef: React.RefObject<HTMLDivElement | null>;
  workspaceRef: React.RefObject<HTMLDivElement | null>;
}

export const DragHint: React.FC<DragHintProps> = ({
  paletteRef,
  workspaceRef,
}) => {
  const [coords, setCoords] = useState<{
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);

  const level = useEcsStore((s) => s.levelData);
  const [cmd] = level.commands;

  const hintItem: IWorkspaceItem = {
    id: "hint-1",
    command: cmd,
    parent: null,
    variant: "direction",
    count: 0,
    children: [],
  };

  const { state } = useSidebar();

  useLayoutEffect(() => {
    const updateCoords = () => {
      const p = paletteRef.current;
      const w = workspaceRef.current;
      if (!p || !w) {
        setCoords(null);
        return;
      }
      const sourceEl = p.querySelector("[data-palette-item]");
      const targetEl = w.querySelector("[data-workspace-item]");
      if (sourceEl && targetEl) {
        const src = sourceEl.getBoundingClientRect();
        const tgt = targetEl.getBoundingClientRect();
        setCoords({
          from: { x: src.left + src.width / 2, y: src.top + src.height / 2 },
          to: { x: tgt.left + tgt.width / 2, y: tgt.top + tgt.height / 2 },
        });
      } else {
        setCoords(null);
      }
    };

    // initial calculation
    updateCoords();
    // recalc on window resize
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("resize", updateCoords);
    };
  }, [paletteRef, workspaceRef, level, state]);

  if (!coords || level.guides.length === 0) {
    return null;
  }

  const dx = coords.to.x - coords.from.x;
  const dy = coords.to.y - coords.from.y;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: coords.from.x - 28,
        top: coords.from.y - 28,
        width: 56,
        height: 56,
        pointerEvents: "none",
        zIndex: 9999,
      }}
      animate={{
        x: [0, dx, dx],
        y: [0, dy, dy],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
        repeat: Infinity,
        repeatDelay: 0.8,
      }}
    >
      <div className="w-full h-full opacity-80">
        <BaseCommand type="palette" item={hintItem as IBaseCommand} />
      </div>
    </motion.div>
  );
};
