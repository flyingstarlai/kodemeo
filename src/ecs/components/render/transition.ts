import { component, field } from "@lastolivegames/becsy";

@component
export class Transition {
  @field.float64 declare alpha: number;
  @field.float64 declare target: number;
  @field.float64 declare speed: number;
}
