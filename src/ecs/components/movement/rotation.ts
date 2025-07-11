import { component, field } from "@lastolivegames/becsy";

@component
export class Rotation {
  @field.float32 declare angle: number;
}
