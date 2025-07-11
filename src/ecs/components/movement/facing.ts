import { component, field } from "@lastolivegames/becsy";

@component
export class Facing {
  @field.staticString(["up", "down", "left", "right"])
  declare direction: "up" | "down" | "left" | "right";
}
