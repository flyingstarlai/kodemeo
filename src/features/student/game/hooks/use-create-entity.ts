import { useRef, useEffect, useState } from "react";
import { useEcsStore } from "@/stores/use-ecs-store";

/**
 * Returns a stable entity ID, creating it exactly once.
 * Until the effect has run, returns `null`. After creation, always returns a number.
 *
 * Usage:
 *   const eid = useCreateEntity();
 *   if (eid === null) return null;
 *   // now you have a valid eid
 */
export function useCreateEntity(): number | null {
  // Grab the `createEntity` action from our ECS store:
  const createEntity = useEcsStore((s) => s.createEntity);

  // We keep the newly‐created ID in a ref, so it never changes once set:
  const eidRef = useRef<number | null>(null);
  // We also track a boolean that tells React “the ID has been generated”
  const [hasCreated, setHasCreated] = useState(false);

  useEffect(() => {
    // Only run on mount. If we haven’t created one yet, do so now:
    if (!hasCreated) {
      eidRef.current = createEntity();
      setHasCreated(true);
    }
    // The empty dependency array means “this effect runs exactly once, on mount.”
  }, [createEntity, hasCreated]);

  // Until `hasCreated` flips to true, we return null. On the next render, it returns the new ID.
  return hasCreated ? eidRef.current : null;
}
