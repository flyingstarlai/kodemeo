import { component, field } from "@lastolivegames/becsy";

@component
export class Movement {
  @field.float64 declare progress: number;
  @field.int8 declare duration: number;
}
