import { component, field } from "@lastolivegames/becsy";

@component
export class PlaySession {
  @field.object declare session: string;
}
