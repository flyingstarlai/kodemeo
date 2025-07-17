import React, { useRef, useState } from "react";
import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { BackgroundSprite } from "@/features/dashboard/game/renders/background-sprite.tsx";
import { LevelSprite } from "@/features/dashboard/game/renders/level-sprite.tsx";
import { WorldInitializer } from "@/features/dashboard/game/components/world-initializer.tsx";
import { PlayerAnimatedSprite } from "@/features/dashboard/game/renders/player-animated-sprite.tsx";
import { CollectibleAnimatedSprite } from "@/features/dashboard/game/renders/collectible-animated-sprite.tsx";
import { TreasureSprite } from "@/features/dashboard/game/renders/treasure-sprite.tsx";
import { ScoreSprite } from "@/features/dashboard/game/renders/score-sprite.tsx";
import { SubmitChallengeEffect } from "@/features/dashboard/game/components/submit-challenge-effect.tsx";
import { LevelLoader } from "@/features/dashboard/game/components/level-loader.tsx";
import { ScreenTransition } from "@/features/dashboard/game/renders/screen-transition.tsx";
import { ResizeSync } from "@/features/dashboard/game/components/resize-sync.tsx";
import { GameConstants } from "@/features/dashboard/game/constans.ts";
import {
  WorldScrollableContainer,
  type ScrollableContentHandle,
} from "@/features/dashboard/game/components/world-scrollable-container.tsx";
import { CommandSheetContainer } from "@/features/dashboard/command/components/command-sheet-container.tsx";
import { ScrollCenterButton } from "@/features/dashboard/game/components/scroll-center-button.tsx";

const GameCanvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollableContentHandle>(null);
  const [screen, setScreen] = useState({
    width: GameConstants.GAME_WIDTH,
    height: GameConstants.GAME_HEIGHT,
  });

  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  console.log("rendering game canvas");

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <ScrollCenterButton />

        <CommandSheetContainer />
      </div>
      <Application
        width={screen.width}
        height={screen.height}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={0x2a8431}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <WorldInitializer />
        <WorldScrollableContainer
          ref={scrollRef}
          screenWidth={screen.width}
          screenHeight={screen.height}
          contentWidth={GameConstants.GAME_WIDTH}
          contentHeight={GameConstants.GAME_HEIGHT}
        >
          <BackgroundSprite />
          <LevelSprite />
          <CollectibleAnimatedSprite />
          <TreasureSprite />
          <PlayerAnimatedSprite />
        </WorldScrollableContainer>
        <ScoreSprite />
        <ScreenTransition color={0x2a8431} />
        <ResizeSync resizeRef={wrapperRef} onResize={setScreen} />
      </Application>
      <SubmitChallengeEffect />
      <LevelLoader />
    </div>
  );
};

export default GameCanvas;
