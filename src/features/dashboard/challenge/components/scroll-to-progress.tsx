import { useGetChallenges } from "@/features/dashboard/challenge/hooks/use-get-challenges.ts";
import { useEffect } from "react";
import type { GroupLayer, ObjectLayer, TiledMap } from "@/lib/tilemap-group.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";

interface Props {
  map: TiledMap;
  page: number;
  courseSlug?: string;
}

export const ScrollToProgress: React.FC<Props> = ({
  map,
  page,
  courseSlug,
}) => {
  const { data: challenges } = useGetChallenges(courseSlug);
  const scrollTo = useUIStore((s) => s.scrollToCenter);

  useEffect(() => {
    if (!page || !challenges) return;

    const levelsPerPage = 12;
    const pageStart = (page - 1) * levelsPerPage + 1;
    const pageEnd = pageStart + levelsPerPage - 1;

    const pageChallenges = challenges.filter(
      (ch) => ch.level >= pageStart && ch.level <= pageEnd,
    );

    let targetLevel: number;

    if (pageChallenges.every((ch) => ch.isLocked)) {
      // All levels locked — scroll to first level of the page
      targetLevel = pageStart;
    } else {
      // Scroll to highest unlocked level in the page
      targetLevel = pageChallenges
        .filter((ch) => !ch.isLocked)
        .reduce((max, ch) => (ch.level > max ? ch.level : max), pageStart);
    }

    const group = map.layers.find(
      (l): l is GroupLayer => l.type === "group" && l.name === `week_${page}`,
    );
    if (!group) return;

    const markerLayer = group.layers.find(
      (l): l is ObjectLayer => l.type === "objectgroup" && l.name === "marker",
    );
    if (!markerLayer) return;

    const objName = `level_${targetLevel}`;
    const targetObj = markerLayer.objects.find((obj) => obj.name === objName);

    if (!targetObj) return;

    const timeout = setTimeout(() => {
      scrollTo({
        x: targetObj.x,
        y: targetObj.y,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [challenges, map.layers, page, scrollTo]);
  return null;
};
