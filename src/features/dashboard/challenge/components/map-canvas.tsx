import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useRef } from "react";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { WorldContainer } from "@/features/dashboard/game/components/world-container.tsx";
import { ScreenResponsive } from "@/features/dashboard/game/components/screen-responsive.tsx";
import { BackgroundMapSprite } from "@/features/dashboard/challenge/renders/background-map-sprite.tsx";
import { ChallengeFlagsSprite } from "@/features/dashboard/challenge/renders/challenge-flags-sprite.tsx";
import { SpriteButton } from "@/components/sprite-button.tsx";
import { getAnimalFrame } from "@/lib/animals-frame.ts";

const screenColor = 0xc9d308;

const animals = [
  "frog",
  "duck",
  "cat",
  "owl",
  "dog",
  "tiger",
  "zebra",
  "elephant",
];

export const MapCanvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { course: courseSlug } = useParams({ strict: false });
  const { page } = useSearch({ strict: false }) as { page: number };
  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative   flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {animals.map((n, i) => (
          <Link key={n} to="." search={() => ({ page: i + 1 })} replace>
            <SpriteButton frame={getAnimalFrame(n)} active={page === i + 1} />
          </Link>
        ))}
      </div>
      <Application
        key={`map-${courseSlug}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <WorldContainer>
          <BackgroundMapSprite />
          <ChallengeFlagsSprite />
        </WorldContainer>
        <ScreenResponsive resizeRef={wrapperRef} />
      </Application>
    </div>
  );
};
