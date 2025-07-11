import { System, system } from "@lastolivegames/becsy";
import { MarkAsDeletedTag } from "@/ecs/components";
import { cleanupGroup } from "./system-group.ts";
import { CleanupSystem } from "@/ecs/systems/cleanup-system.ts";
import { sysLogger } from "@/lib/logger.ts";

@system(cleanupGroup, (s) => s.after(CleanupSystem))
export class DeleterSystem extends System {
  private readonly entities = this.query(
    (q) => q.current.with(MarkAsDeletedTag).usingAll.write,
  );
  execute() {
    for (const entity of this.entities.current) {
      sysLogger.log("Delete entity", entity.ordinal);
      entity.delete();
    }
  }
}
