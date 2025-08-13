import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTick } from "@pixi/react";
import type { FederatedPointerEvent } from "pixi.js";
import { usePlayerSpriteStore } from "@/features/dashboard/game/store/use-player-sprite-store.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { getPlayerGlobalPosition } from "@/lib/position.ts";
import { useCommandSheetStore } from "@/features/dashboard/command/store/use-command-sheet-store.ts";

export interface ScrollableContentHandle {
  scrollBy: (dx: number, dy: number) => void;
  scrollTo: (x: number, y: number) => void;
  scrollToCenter: (x: number, y: number) => void;
}

interface Props {
  screenWidth: number;
  screenHeight: number;
  contentWidth: number;
  contentHeight: number;
  children: React.ReactNode;
}

export const WorldScrollableContainer = forwardRef<
  ScrollableContentHandle,
  Props
>(
  (
    { screenWidth, screenHeight, contentWidth, contentHeight, children },
    ref,
  ) => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const targetPos = useRef({ x: 0, y: 0 });
    const dragStart = useRef<{ x: number; y: number } | null>(null);
    const isSheetOpen = useCommandSheetStore((s) => s.isOpen);
    const [spriteData] = usePlayerSpriteStore((s) => s.sprites);
    const pendingCommand = useUIStore((s) => s.isPendingCommand);

    const scrollTarget = useUIStore((s) => s.scrollTarget);

    // Compute scale, center offset, clamp logic, scroll flags
    const { scale, centerX, centerY, clamp, shouldScrollX, shouldScrollY } =
      useMemo(() => {
        const rawScale = screenWidth / contentWidth;
        const scale = Math.min(Math.max(rawScale, 1), 1.5);

        const scaledWidth = contentWidth * scale;
        const scaledHeight = contentHeight * scale;

        const centerX =
          screenWidth > scaledWidth ? (screenWidth - scaledWidth) / 2 : 0;
        const centerY =
          screenHeight > scaledHeight ? (screenHeight - scaledHeight) / 2 : 0;

        const scrollMinX = Math.min(0, screenWidth - scaledWidth);
        const scrollMinY = Math.min(0, screenHeight - scaledHeight);

        const clamp = (x: number, y: number) => ({
          x: shouldScrollX ? Math.max(scrollMinX, Math.min(0, x)) : centerX,
          y: shouldScrollY
            ? Math.max(scrollMinY, Math.min(centerY, y))
            : centerY,
        });

        const shouldScrollX = screenWidth < scaledWidth;
        const shouldScrollY = screenHeight < scaledHeight;

        return { scale, centerX, centerY, clamp, shouldScrollX, shouldScrollY };
      }, [screenWidth, screenHeight, contentWidth, contentHeight]);

    const scrollToCenterInternal = useCallback(
      (targetX: number, targetY: number) => {
        const newTarget = {
          x: shouldScrollX
            ? screenWidth / 2 - targetX * scale
            : targetPos.current.x,
          y: shouldScrollY
            ? screenHeight / 2 - targetY * scale
            : targetPos.current.y,
        };

        targetPos.current = clamp(newTarget.x, newTarget.y);
      },
      [shouldScrollX, screenWidth, scale, shouldScrollY, screenHeight, clamp],
    );

    useEffect(() => {
      if (scrollTarget) {
        scrollToCenterInternal(scrollTarget.x, scrollTarget.y);
        // if (!scrollTarget.global) {
        //   const { posX, posY } = getPlayerGlobalPosition(
        //     scrollTarget.x,
        //     scrollTarget.y,
        //   );
        //   scrollToCenterInternal(posX, posY);
        // } else {
        //   scrollToCenterInternal(scrollTarget.x, scrollTarget.y);
        // }
      }
    }, [scrollTarget, scrollToCenterInternal]);

    // 🔁 Auto-scroll to player on pendingCommand
    useEffect(() => {
      if (!pendingCommand || !spriteData) return;

      const { posX, posY } = getPlayerGlobalPosition(
        spriteData.x,
        spriteData.y,
      );

      scrollToCenterInternal(posX, posY);
    }, [
      pendingCommand,
      spriteData,
      scale,
      clamp,
      screenWidth,
      screenHeight,
      shouldScrollX,
      shouldScrollY,
      scrollToCenterInternal,
    ]);

    // 🌀 Smooth scroll with lerp
    useTick(() => {
      const dx = targetPos.current.x - pos.x;
      const dy = targetPos.current.y - pos.y;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        setPos((prev) => ({
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16,
        }));
      } else {
        setPos({
          x: Math.round(targetPos.current.x),
          y: Math.round(targetPos.current.y),
        });
      }
    });

    // 🧭 External control
    useImperativeHandle(
      ref,
      () => ({
        scrollBy: (dx, dy) => {
          const next = {
            x: shouldScrollX ? targetPos.current.x + dx : targetPos.current.x,
            y: shouldScrollY ? targetPos.current.y + dy : targetPos.current.y,
          };
          targetPos.current = clamp(next.x, next.y);
        },
        scrollTo: (x, y) => {
          targetPos.current = clamp(x, y);
        },
        scrollToCenter: scrollToCenterInternal,
      }),
      [shouldScrollX, shouldScrollY, clamp, scrollToCenterInternal],
    );

    // 🖱️ Pointer drag
    const onPointerDown = (e: FederatedPointerEvent) => {
      if (isSheetOpen) return;
      dragStart.current = {
        x: e.global.x - targetPos.current.x,
        y: e.global.y - targetPos.current.y,
      };
    };

    const onPointerMove = (e: FederatedPointerEvent) => {
      if (isSheetOpen) return;
      if (!dragStart.current) return;
      const x = e.global.x - dragStart.current.x;
      const y = e.global.y - dragStart.current.y;

      targetPos.current = clamp(x, y);
    };

    const onPointerUp = () => {
      dragStart.current = null;
    };

    return (
      <pixiContainer
        x={shouldScrollX ? Math.round(pos.x) : Math.round(centerX)}
        y={shouldScrollY ? Math.round(pos.y) : Math.round(centerY)}
        scale={{ x: scale, y: scale }}
        eventMode="static"
        interactiveChildren
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerUpOutside={onPointerUp}
      >
        {children}
      </pixiContainer>
    );
  },
);
