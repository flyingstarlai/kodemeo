import { component, field } from "@lastolivegames/becsy";

@component
export class LevelProgress {
  @field.boolean declare isOver: boolean;
  @field.boolean declare onGoal?: boolean;
}
