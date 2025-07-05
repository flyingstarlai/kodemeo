import { EntityContext } from "@/providers/entity-context.ts";

/**
 * Simply holds whatever `eid` its parent passes.
 * It does **not** itself call `createEntity()`.
 */
export const EntityProvider: React.FC<{
  eid: number;
  children?: React.ReactNode;
}> = ({ eid, children }) => {
  return (
    <EntityContext.Provider value={eid}>{children}</EntityContext.Provider>
  );
};
