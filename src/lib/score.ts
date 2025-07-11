export function computeStars(
  onGoal: boolean,
  collectedCoins: number,
  totalCoins: number,
  commandCount: number,
  maxStep: number,
): number {
  let stars = 0;

  // +1 if collected all coins
  if (collectedCoins >= totalCoins) {
    stars++;
  }
  // +1 if used no more than maxStep commands
  if (commandCount <= maxStep) {
    stars++;
  }

  if (onGoal) {
    stars++;
  } else {
    stars = 0;
  }
  return stars;
}
