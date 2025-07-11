import { component, field } from "@lastolivegames/becsy";

@component
export class GridPosition {
  @field.float32 declare col: number;
  @field.float32 declare row: number;
}
