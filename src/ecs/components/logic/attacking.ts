import { component, field } from "@lastolivegames/becsy";

@component
export class Attacking {
  @field.boolean declare hasTarget: boolean;
  @field.float32 declare targetCol: number;
  @field.float32 declare targetRow: number;
}
