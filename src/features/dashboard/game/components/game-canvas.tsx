import React, { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { BackgroundSprite } from "@/features/dashboard/game/renders/background-sprite.tsx";
import { LevelSprite } from "@/features/dashboard/game/renders/level-sprite.tsx";
import { WorldInitializer } from "@/features/dashboard/game/components/world-initializer.tsx";
import { PlayerAnimatedSprite } from "@/features/dashboard/game/renders/player-animated-sprite.tsx";
import { CollectibleAnimatedSprite } from "@/features/dashboard/game/renders/collectible-animated-sprite.tsx";
import { TreasureSprite } from "@/features/dashboard/game/renders/treasure-sprite.tsx";
import { ScoreText } from "@/features/dashboard/game/renders/score-text.tsx";
import { SubmitChallengeEffect } from "@/features/dashboard/game/components/submit-challenge-effect.tsx";
import { LevelLoader } from "@/features/dashboard/game/components/level-loader.tsx";
import { ScreenTransition } from "@/features/dashboard/game/renders/screen-transition.tsx";
import { BoardContainer } from "./board-container.tsx";
import { WorldContainer } from "./world-container.tsx";
import { ScreenResponsive } from "@/features/dashboard/game/components/screen-responsive.tsx";

const GameCanvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

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
      className="flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <Application
        key={`game-${Math.random()}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={0x2a8431}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <WorldInitializer />
        <WorldContainer>
          <BackgroundSprite />

          <BoardContainer>
            <LevelSprite />
            <ScoreText />
            <CollectibleAnimatedSprite />
            <TreasureSprite />
            <PlayerAnimatedSprite />
          </BoardContainer>
        </WorldContainer>
        <ScreenTransition color={0x2a8431} />
        <ScreenResponsive resizeRef={wrapperRef} />
      </Application>
      <SubmitChallengeEffect />
      <LevelLoader />
    </div>
  );
};

export default GameCanvas;
