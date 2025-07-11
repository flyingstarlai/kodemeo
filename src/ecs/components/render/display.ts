import { component, field } from "@lastolivegames/becsy";

@component
export class Display {
  @field.uint32 declare color: number;
  @field.float32 declare size: number;
}
