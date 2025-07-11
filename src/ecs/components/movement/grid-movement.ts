import { component, field } from "@lastolivegames/becsy";

@component
export class GridMovement {
  @field.float32 declare startCol: number;
  @field.float32 declare startRow: number;
  @field.float32 declare destCol: number;
  @field.float32 declare destRow: number;
  @field.float64 declare progress: number;
  @field.float32 declare duration: number;
}
