import { component, field } from "@lastolivegames/becsy";

@component
export class Velocity {
  @field.float64 declare vx: number;
  @field.float64 declare vy: number;
}
