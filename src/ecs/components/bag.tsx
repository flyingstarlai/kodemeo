import { useEntityId } from "@/features/student/game/hooks/use-entity-id";
import { useEffect } from "react";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component.ts";

export const Bag: React.FC<{ coins: number }> = ({ coins }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  useEffect(() => {
    addComponent(eid, "bag", { coins });
    return () => {
      removeComponent(eid, "bag");
    };
  }, [eid, addComponent, coins, removeComponent]);
  return null;
};
