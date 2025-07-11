// === Import All Systems ===
export { InputSystem } from "./input-system.ts";
export { CommandSystem } from "./command-system.ts";
export { MovementSystem } from "./movement-system.ts";
export { CollectSystem } from "./collect-system.ts";
export { PlayerRenderSystem } from "./player-render-system.ts";
export { CollectibleRenderSystem } from "./collectible-render-system.ts";
export { TreasureRenderSystem } from "./treasure-render-system.ts";
export { DeleterSystem } from "./deleter-system.ts";
export { SpawnerSystem } from "./spawner-system.ts";
export { CleanupSystem } from "./cleanup-system.ts";
export { TransitionSystem } from "./transition-system.ts";

// === Grouping ===
import {
  inputGroup,
  logicGroup,
  renderGroup,
  cleanupGroup,
  spawnerGroup,
} from "./system-group.ts";

// === Schedule Between Groups ===
spawnerGroup.schedule((s) => s.before(inputGroup));
inputGroup.schedule((s) => s.before(logicGroup));
logicGroup.schedule((s) => s.before(renderGroup));
renderGroup.schedule((s) => s.before(cleanupGroup));
