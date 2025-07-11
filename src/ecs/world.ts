import { World } from "@lastolivegames/becsy";
import "./components";
import "./systems";

let worldDef: Promise<World> | null = null;

export async function createWorld() {
  if (worldDef) {
    return worldDef;
  }
  worldDef = World.create();
  return worldDef;
}

export async function disposeWorld() {
  if (worldDef) {
    console.log("disposeWorld");
    const world = await worldDef;
    await world.terminate();
    worldDef = null;
  }
}
