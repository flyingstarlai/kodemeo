import { component, field } from "@lastolivegames/becsy";

@component
export class SpriteAnimation {
  @field.staticString(["idle", "walk", "scratch", "whacked", "rotate"])
  declare name: "idle" | "walk" | "scratch" | "whacked" | "rotate";
  @field.float32 declare frames: number;
  @field.boolean declare isPlaying: boolean;
}
