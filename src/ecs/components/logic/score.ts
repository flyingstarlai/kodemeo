import { component, field } from "@lastolivegames/becsy";

@component
export class Score {
  @field.int32 declare stars: number;
}
