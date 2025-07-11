import { component, field } from "@lastolivegames/becsy";

@component
export class Elapsed {
  @field.float32 declare value: number;
}
