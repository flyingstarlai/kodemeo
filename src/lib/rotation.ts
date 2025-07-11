export function getRotationFromTarget(
  startCol: number,
  startRow: number,
  destCol: number,
  destRow: number,
): number {
  if (destCol > startCol) {
    return Math.PI / 2; // moving right
  } else if (destCol < startCol) {
    return -Math.PI / 2; // moving left
  } else if (destRow > startRow) {
    return Math.PI; // moving down
  }
  return 0;
}

export function getRotationFromFacing(
  direction: "up" | "down" | "left" | "right",
): number {
  if (direction === "right") {
    return Math.PI / 2; // moving right
  } else if (direction === "left") {
    return -Math.PI / 2; // moving left
  } else if (direction === "down") {
    return Math.PI; // moving down
  }
  return 0;
}
