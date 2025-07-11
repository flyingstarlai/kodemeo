import { system, System } from "@lastolivegames/becsy";
import { useManagerStore } from "@/features/dashboard/game/store/use-manager-store.ts";
import { PlayerTag, Queue } from "../components";
import { inputGroup } from "./system-group.ts";

@system(inputGroup)
export class InputSystem extends System {
  private readonly players = this.query(
    (q) => q.current.with(PlayerTag).using(Queue).write,
  );

  execute(): void {
    const [player] = this.players.current;
    if (!player) return;

    const { executeNow, commands, setExecuteNow } = useManagerStore.getState();
    if (executeNow && commands.length > 0) {
      if (player.has(Queue)) {
        player.write(Queue).commands = commands.slice();
      } else {
        player.add(Queue, { commands: commands.slice() });
      }

      setExecuteNow(false);
    }
  }
}
