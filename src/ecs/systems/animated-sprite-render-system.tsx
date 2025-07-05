import React, { useRef } from "react";
import { useTick } from "@pixi/react";
import { AnimatedSprite } from "pixi.js";
import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useMovementStore } from "@/stores/use-movement-store";
import { useAssets } from "@/providers/asset-context.ts";
import {
  getFacingDirection,
  getFacingRotation,
} from "@/features/student/game/utils/facing-utils.ts";

export const AnimatedSpriteRenderSystem: React.FC = () => {
  // 1) Grab the single player entity id
  const [eid] = useEntityQuery(["playerTag"]);
  const [manEid] = useEntityQuery(["session"]);
  const spriteRef = useRef<AnimatedSprite>(null);

  // 2) Cache the store APIs and assets once
  const ecs = useEcsStore.getState();
  const mover = useMovementStore.getState();
  const { cat } = useAssets();

  // 4) Single useTick to update pos, texture, speed, rotation
  useTick((ticker) => {
    if (eid == null) return;
    const sprite = spriteRef.current;
    if (!sprite) return;

    // a) Imperatively pull facets
    const posFacet = mover.getComponent(eid, "position");
    const moveFacet = mover.getComponent(eid, "movement");
    const gridMov = ecs.getComponent(eid, "gridMovement");
    const animFacet = ecs.getComponent(eid, "spriteAnimation");
    const facingFacet = ecs.getComponent(eid, "facing");
    const progressFacet = ecs.getComponent(manEid, "progress");

    // b) Update texture & animationSpeed if needed
    if (animFacet) {
      const textures = cat.animations[animFacet.name];
      if (sprite.textures !== textures) {
        sprite.textures = textures;
      }
      sprite.animationSpeed = animFacet.fps / 60;

      if (!sprite.playing) {
        sprite.play();
      }
    }

    // c) Update position
    if (posFacet) {
      sprite.x = posFacet.x;
      sprite.y = posFacet.y;
    }

    // d) Rotation logic
    const dt = ticker.deltaTime / (ticker.FPS || 60);
    let nextRot = sprite.rotation;

    // moving → smooth‐turn
    if (
      gridMov &&
      moveFacet &&
      (gridMov.destCol !== gridMov.startCol ||
        gridMov.destRow !== gridMov.startRow)
    ) {
      const target = getFacingRotation(
        gridMov.startCol,
        gridMov.startRow,
        gridMov.destCol,
        gridMov.destRow,
      );
      let diff = target - nextRot;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      else if (diff < -Math.PI) diff += 2 * Math.PI;
      const maxDelta = Math.PI * 2 * dt; // 360°/sec
      nextRot =
        Math.abs(diff) <= maxDelta
          ? target
          : nextRot + Math.sign(diff) * maxDelta;
    }
    // stationary → snap to facing facet
    else if (facingFacet && !progressFacet?.isOver) {
      nextRot = getFacingDirection(facingFacet.direction);
    }

    sprite.rotation = nextRot;
  });

  // 5) Render exactly one Pixi sprite; React re‐renders here only if `eid` changes

  const initialAnim = useEcsStore
    .getState()
    .getComponent(eid, "spriteAnimation");

  const initialTextures = initialAnim
    ? cat.animations[initialAnim.name]
    : cat.animations["idle"];

  return (
    <pixiAnimatedSprite
      ref={spriteRef}
      key={eid}
      anchor={0.5}
      textures={initialTextures}
      loop={true}
      autoPlay={true}
    />
  );
};
