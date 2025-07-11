import { system, System } from "@lastolivegames/becsy";
import {
  PlayerTag,
  CollectibleTag,
  Bag,
  GridPosition,
  MarkAsDeletedTag,
} from "../components";
import { logicGroup } from "./system-group.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { playSound } from "@/lib/sounds.ts";

@system(logicGroup)
export class CollectSystem extends System {
  // query player
  private readonly players = this.query(
    (q) => q.current.with(PlayerTag, GridPosition).and.with(Bag).write,
  );
  // query collectible coins
  private readonly coins = this.query((q) =>
    q.current.without(MarkAsDeletedTag).write.and.with(CollectibleTag),
  );

  execute(): void {
    const [player] = this.players.current;
    if (!player) return;

    const pCol = player.read(GridPosition).col;
    const pRow = player.read(GridPosition).row;
    const bag = player.write(Bag);

    for (const coin of this.coins.current) {
      const cPos = coin.read(GridPosition);

      if (pCol === cPos.col && pRow === cPos.row) {
        coin.add(MarkAsDeletedTag);
        bag.coins += 1;
        useCollectibleStore.getState().setCoins(bag.coins);

        playSound("collectCoin", { volume: 0.5 });
      }
    }
  }
}
