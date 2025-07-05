import { useEcsStore } from "@/stores/use-ecs-store.ts";

const useRemoveComponent = () => useEcsStore((s) => s.removeComponent);
export default useRemoveComponent;
