import {
  sliceSpritesheet,
  type TiledMap,
  type GroupLayer,
  type ObjectLayer,
  type TiledObject,
} from "@/lib/tilemap-group.ts";
import { useAssets } from "@/providers/asset-context.ts";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetChallenges } from "@/features/dashboard/challenge/hooks/use-get-challenges.ts";
import { useBeginChallenge } from "@/features/dashboard/challenge/hooks/use-begin-challenge.ts";
import type { Texture } from "pixi.js";
import { playSound } from "@/lib/sounds.ts";

interface MarkerSpriteProps {
  map: TiledMap;
  page: number;
  courseSlug?: string;
}

export const MarkerSprite: React.FC<MarkerSpriteProps> = ({
  map,
  page,
  courseSlug,
}) => {
  const navigate = useNavigate({ from: "/courses/$course" });
  const { data: challenges } = useGetChallenges(courseSlug);
  const beginMutation = useBeginChallenge(courseSlug);

  const { maps, stars: starTexs } = useAssets();
  const markerTex = maps.mapMarkerTiles;
  const markerTileset = map.tilesets.find((ts) => ts.name === "map_marker");

  const markerFrames = useMemo(() => {
    if (!markerTileset) return [];
    return sliceSpritesheet(markerTex, markerTileset);
  }, [markerTex, markerTileset]);

  useEffect(() => {
    if (!page || !challenges) return;

    const lastProgress = challenges
      .filter((ch) => !ch.isLocked)
      .reduce((max, ch) => (ch.level > max ? ch.level : max), 1);

    console.log("MARKER: Last progress level:", lastProgress);
  }, [challenges, page]);

  if (!markerTileset || markerFrames.length === 0) return null;

  const group = map.layers.find(
    (l): l is GroupLayer => l.type === "group" && l.name === `week_${page}`,
  );
  if (!group) return null;

  const markerLayer = group.layers.find(
    (l): l is ObjectLayer => l.type === "objectgroup" && l.name === "marker",
  );
  if (!markerLayer || markerLayer.objects.length === 0) return null;

  if (!challenges || challenges.length === 0) {
    return;
  }

  const handleStart = (challengeId: string, isLocked: boolean) => {
    if (isLocked) return;

    playSound("select");
    beginMutation.mutate(
      { challengeId },
      {
        onSuccess: async () => {
          await navigate({
            to: `/courses/$course/playground`,
            params: { course: courseSlug! },
            search: { level: challengeId },
          });
        },
      },
    );
  };

  return (
    <>
      {markerLayer.objects.map((obj: TiledObject) => {
        const frameIndex = obj.gid - markerTileset.firstgid;
        let texture = markerFrames[frameIndex];

        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y - obj.height / 2;

        // find the persisted progress for that level

        const challenge = challenges.find(
          (ch) => obj.name === `level_${ch.level}`,
        );

        if (!challenge) return null;

        const { challengeId, stars, isLocked } = challenge;
        if (!isLocked) texture = markerFrames[2];

        if (stars > 0) texture = markerFrames[7];

        if (!texture) return null;

        let starTex: Texture | null = null;
        if (!isLocked) {
          if (stars === 1) starTex = starTexs.star1of3;
          else if (stars === 2) starTex = starTexs.star2of3;
          else if (stars === 3) starTex = starTexs.star3of3;
        }

        console.log("render marker", challenge.level);

        return (
          <pixiContainer key={`marker-${obj.id}`} x={centerX} y={centerY}>
            <pixiSprite
              eventMode="static"
              interactive={true}
              cursor={"pointer"}
              texture={texture}
              anchor={0.5}
              scale={0.9}
              onPointerTap={() => {
                handleStart(challengeId, isLocked);
              }}
            />
            {starTex && (
              <pixiSprite
                texture={starTex}
                roundPixels={true}
                anchor={0.5}
                scale={0.8}
                y={-40}
              />
            )}
          </pixiContainer>
        );
      })}
    </>
  );
};
