import { useEcsStore } from "@/stores/use-ecs-store.ts";

const useAddComponent = () => useEcsStore((s) => s.addComponent);
export default useAddComponent;
