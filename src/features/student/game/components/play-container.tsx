import React, { useEffect, useRef } from "react";
import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { useSidebar } from "@/components/ui/sidebar";
import { useSearch } from "@tanstack/react-router";
import { useEcsStore } from "@/stores/use-ecs-store";
import { ResponsiveSystem } from "@/ecs/systems/responsive-system";
import { WorldContainer } from "@/features/student/game/components/world-container.tsx";
import { TransitionSystem } from "@/ecs/systems/transition-system";
import { LoadLevelSystem } from "@/ecs/systems/load-level-system.tsx";
import { GameManagerEntity } from "@/ecs/entities/game-manager-entity.tsx";
import { PlayerEntity } from "@/ecs/entities/player-entity";
import { ChestEntity } from "@/ecs/entities/chest-entity.tsx";
import { CollectibleEntitiesWrapper } from "@/features/student/game/components/collectible-entities-wrapper.tsx";
import { TileEntitiesWrapper } from "@/features/student/game/components/tile-entities-wrapper.tsx";
import { TilemapRenderSystem } from "@/ecs/systems/tilemap-render-system.tsx";
import { BoardContainer } from "@/features/student/game/components/board-container.tsx";
import { ScoreRenderSystem } from "@/ecs/systems/score-render-system.tsx";
import { BoardRenderSystem } from "@/ecs/systems/board-render-system.tsx";
import { LevelsRenderSystem } from "@/ecs/systems/levels-render-system.tsx";
import { GraphicRenderSystem } from "@/ecs/systems/graphic-render-system.tsx";
import { ChestSpriteRenderSystem } from "@/ecs/systems/chest-sprite-render-system.tsx";
import { CoinsRenderSystem } from "@/ecs/systems/coins-render-system.tsx";
import { AnimatedSpriteRenderSystem } from "@/ecs/systems/animated-sprite-render-system.tsx";
import { CommandSystem } from "@/ecs/systems/command-system.tsx";
import { CollectCoinSystem } from "@/ecs/systems/collect-coin-system.tsx";
import { MovementSystem } from "@/ecs/systems/movement-system.tsx";
import { MovementSoundSystem } from "@/ecs/systems/movement-sound-system.tsx";

const screenColor = 0x2a8431;

const PlayContainer: React.FC = () => {
  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sidebar = useSidebar();
  const { level } = useSearch({ strict: false });
  const resetEntityId = useEcsStore((s) => s.resetNextId);

  useEffect(() => {
    resetEntityId();
  }, [level, resetEntityId]);

  // triggering the ResizeObserver inside ResponsiveSystem.
  useEffect(() => {}, [sidebar.state]);

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <Application
        key={`game-${level}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <GameManagerEntity />
        <PlayerEntity />
        <CollectibleEntitiesWrapper />
        <TileEntitiesWrapper />
        <ChestEntity />

        <ResponsiveSystem resizeRef={wrapperRef} />
        <WorldContainer>
          <TilemapRenderSystem />
          <BoardContainer>
            <ScoreRenderSystem />
            <BoardRenderSystem />
            <LevelsRenderSystem />
            <GraphicRenderSystem />
            <CoinsRenderSystem />
            <ChestSpriteRenderSystem />
            <AnimatedSpriteRenderSystem />
          </BoardContainer>
        </WorldContainer>
        <CommandSystem />
        <CollectCoinSystem />
        <MovementSystem />
        <MovementSoundSystem />
        <LoadLevelSystem />
        <TransitionSystem onComplete={() => {}} color={screenColor} />
      </Application>
    </div>
  );
};

export default PlayContainer;
