import { component, field } from "@lastolivegames/becsy";

@component
export class MarkAsDestroyed {
  @field.object declare enemies: { col: number; row: number }[];
}
