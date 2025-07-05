import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useRef } from "react";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { TransitionSystem } from "@/ecs/systems/transition-system.tsx";
import { ResponsiveSystem } from "@/ecs/systems/responsive-system.tsx";
import { WorldContainer } from "@/features/student/game/components/world-container.tsx";
import { ChallengeMapRenderSystem } from "@/ecs/systems/challenge-map-render-system.tsx";
import { ChallengeProgressRenderSystem } from "@/ecs/systems/challenge-progress-render-system.tsx";

const screenColor = 0xc9d308;

export const ChallengesMap: React.FC = () => {
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
        {[1, 2, 3].map((n) => (
          <Link key={n} to="." search={() => ({ page: n })} replace>
            <Button
              className="opacity-70"
              variant={page === n ? "default" : "outline"}
            >
              {n}
            </Button>
          </Link>
        ))}
      </div>
      <Application
        key={`map-${courseSlug}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <ResponsiveSystem resizeRef={wrapperRef} />
        <WorldContainer>
          <ChallengeMapRenderSystem />
          <ChallengeProgressRenderSystem />
        </WorldContainer>
        <TransitionSystem onComplete={() => {}} color={screenColor} />
      </Application>
    </div>
  );
};
