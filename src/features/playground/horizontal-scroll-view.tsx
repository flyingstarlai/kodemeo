import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import type { FederatedPointerEvent } from "pixi.js";
import { useTick } from "@pixi/react";

export interface HorizontalScrollHandle {
  scrollBy: (deltaX: number) => void;
}

interface Props {
  screenWidth: number;
  screenHeight: number;
  contentWidth: number; // e.g. 4800
  contentHeight: number; // e.g. 720
  children: React.ReactNode;
}

export const HorizontalScrollView = forwardRef<HorizontalScrollHandle, Props>(
  (
    { screenWidth, screenHeight, contentWidth, contentHeight, children },
    ref,
  ) => {
    const [currentOffsetX, setCurrentOffsetX] = useState(0);
    const targetOffsetX = useRef(0);
    const startX = useRef<number | null>(null);

    // ✅ Compute scale, vertical offset, scroll limit
    const { scale, offsetY, clamp } = useMemo(() => {
      const rawScale = screenWidth / contentWidth;
      const scale = Math.min(Math.max(rawScale, 1), 1.5);
      const scaledHeight = contentHeight * scale;
      const offsetY = (screenHeight - scaledHeight) / 2;
      const scrollMin = -(contentWidth * scale - screenWidth);
      const clamp = (val: number) => Math.max(Math.min(val, 0), scrollMin);
      return { scale, offsetY, clamp };
    }, [screenWidth, screenHeight, contentWidth, contentHeight]);

    // ✅ Lerp scroll animation
    useTick(() => {
      const diff = targetOffsetX.current - currentOffsetX;
      if (Math.abs(diff) > 0.5) {
        setCurrentOffsetX((prev) => prev + diff * 0.1);
      } else if (currentOffsetX !== targetOffsetX.current) {
        setCurrentOffsetX(targetOffsetX.current);
      }
    });

    // ✅ Expose scrollBy to parent
    useImperativeHandle(ref, () => ({
      scrollBy: (deltaX: number) => {
        targetOffsetX.current = clamp(targetOffsetX.current + deltaX);
      },
    }));

    // ✅ Drag/Swipe support
    const onPointerDown = (e: FederatedPointerEvent) => {
      startX.current = e.global.x - targetOffsetX.current;
    };

    const onPointerMove = (e: FederatedPointerEvent) => {
      if (startX.current !== null) {
        const desired = e.global.x - startX.current;
        targetOffsetX.current = clamp(desired);
      }
    };

    const onPointerUp = () => {
      startX.current = null;
    };
    // Only scale container once
    return (
      <pixiContainer
        x={currentOffsetX}
        y={offsetY}
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
