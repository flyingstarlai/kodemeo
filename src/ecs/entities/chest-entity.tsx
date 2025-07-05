import { useCreateEntity } from "@/features/student/game/hooks/use-create-entity.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useMemo } from "react";
import { EntityProvider } from "@/providers/entity-provider.tsx";
import { GridPosition } from "@/ecs/components/grid-position.tsx";
import { GoalTag } from "@/ecs/components/goal-tag.tsx";

export const ChestEntity: React.FC = () => {
  const eid = useCreateEntity();
  const level = useEcsStore((s) => s.levelData);

  const { col, row } = useMemo(() => {
    const [goal] = level.goal.length > 0 ? level.goal : [{ col: 0, row: 0 }];
    return goal;
  }, [level.goal]);

  if (eid === null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <GoalTag />
      <GridPosition col={col} row={row} />
    </EntityProvider>
  );
};
