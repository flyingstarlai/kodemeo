import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useRef, useState } from "react";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { SpriteButton } from "@/components/sprite-button.tsx";
import { getAnimalFrame } from "@/lib/animals-frame.ts";
import { RoadMapSprite } from "@/features/dashboard/challenge/renders/road-map-sprite.tsx";
import {
  type ScrollableContentHandle,
  WorldScrollableContainer,
} from "@/features/dashboard/game/components/world-scrollable-container.tsx";
import { GameConstants } from "@/features/dashboard/game/constans.ts";
import { ResizeSync } from "@/features/dashboard/game/components/resize-sync.tsx";
import { useGetAssignedCourse } from "@/features/dashboard/course/hooks/use-get-assigned-course.ts";

const screenColor = 0x57ac23;

const animals = {
  sequence: ["frog", "duck", "cat", "owl"],
  loop: ["dog", "zebra", "tiger", "elephant"],
};

export const MapCanvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollableContentHandle>(null);

  const [screen, setScreen] = useState({
    width: GameConstants.GAME_WIDTH,
    height: GameConstants.GAME_HEIGHT,
  });

  const { course: courseSlug } = useParams({ strict: false });
  const { page } = useSearch({ strict: false }) as { page: number };
  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  const headerMenu =
    courseSlug === "sequence" ? animals.sequence : animals.loop;

  const { data: courses } = useGetAssignedCourse();
  const course = courses?.find((c) => c.slug === courseSlug);
  if (!course) return null;

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative   flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {headerMenu.map((n, i) => {
          const target = i + 1;
          return (
            <Link
              key={n}
              disabled={target > course.availableWeek}
              to="."
              search={() => ({ page: target })}
              replace
            >
              <SpriteButton
                key={n}
                disabled={target > course.availableWeek}
                frame={getAnimalFrame(n)}
                active={page === i + 1}
              />
            </Link>
          );
        })}
      </div>
      <Application
        key={`map-${courseSlug}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <WorldScrollableContainer
          ref={scrollRef}
          screenWidth={screen.width}
          screenHeight={screen.height}
          contentWidth={GameConstants.MAP_WIDTH}
          contentHeight={GameConstants.MAP_HEIGHT}
        >
          <RoadMapSprite />
        </WorldScrollableContainer>
        <ResizeSync resizeRef={wrapperRef} onResize={setScreen} />
      </Application>
    </div>
  );
};
