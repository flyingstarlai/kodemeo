/**
 * Returns a rotation (in radians) so that:
 *  • 0       = up
 *  • +π/2    = right
 *  • π       = down
 *  • -π/2    = left
 *
 * Assumes movement is strictly horizontal or vertical.
 */
export function getFacingRotation(
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

export function getFacingDirection(
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
