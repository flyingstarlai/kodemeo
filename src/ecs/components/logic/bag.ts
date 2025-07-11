import { component, field } from "@lastolivegames/becsy";

@component
export class Bag {
  @field.int32 declare coins: number;
}
