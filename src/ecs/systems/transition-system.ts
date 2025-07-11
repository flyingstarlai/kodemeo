import { system, System } from "@lastolivegames/becsy";
import { renderGroup } from "./system-group.ts";
import { useTransitionStore } from "@/features/dashboard/game/store/use-transition-store.ts";
import { Transition } from "@/ecs/components";

@system(renderGroup)
export class TransitionSystem extends System {
  private readonly transitions = this.query(
    (q) => q.current.with(Transition).write,
  );

  execute(): void {
    const [transition] = this.transitions.current;
    if (!transition) return;

    const state = transition.write(Transition);
    const { alpha, target, speed } = state;

    if (alpha === target) return;

    const delta = Math.sign(target - alpha) * this.delta * speed;
    let nextAlpha = alpha + delta;

    // Clamp to target
    if (
      (delta > 0 && nextAlpha > target) ||
      (delta < 0 && nextAlpha < target)
    ) {
      nextAlpha = target;
    }

    state.alpha = nextAlpha;

    useTransitionStore.getState().setProgress(nextAlpha);
    useTransitionStore.getState().setActive(nextAlpha > 0);
  }
}
