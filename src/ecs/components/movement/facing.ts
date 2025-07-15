import { component, field } from "@lastolivegames/becsy";
import type { CommandType } from "@/ecs/components/logic/queue.ts";

@component
export class Facing {
  @field.staticString(["up", "down", "left", "right"])
  declare direction: CommandType;
}
