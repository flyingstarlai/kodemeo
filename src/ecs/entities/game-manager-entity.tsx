import { nanoid } from "nanoid";
import { useCreateEntity } from "@/features/student/game/hooks/use-create-entity.ts";
import { EntityProvider } from "@/providers/entity-provider.tsx";
import { ManagerTag } from "@/ecs/components/manager-tag.tsx";
import { PlaySession } from "@/ecs/components/play-session.tsx";
import { LevelProgress } from "@/ecs/components/level-progress.tsx";
import { Score } from "@/ecs/components/score.tsx";

export const GameManagerEntity: React.FC = () => {
  const eid = useCreateEntity();

  if (eid == null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <ManagerTag />
      <PlaySession session={nanoid(6)} />
      <LevelProgress isOver={false} onGoal={false} />
      <Score stars={0} />
    </EntityProvider>
  );
};
