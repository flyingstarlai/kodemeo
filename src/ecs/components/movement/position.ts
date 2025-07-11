import { component, field } from "@lastolivegames/becsy";

@component
export class Position {
  @field.float64 declare x: number;
  @field.float64 declare y: number;
}
