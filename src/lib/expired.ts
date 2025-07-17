export function isTokenExpired(
  timestamp: string | null,
  minutes = 60,
): boolean {
  if (!timestamp) return true;
  const createdAt = new Date(parseInt(timestamp)).getTime();
  const now = Date.now();
  const diffMinutes = (now - createdAt) / (1000 * 60);
  return diffMinutes > minutes;
}
/*

new Date("1752718628871").getTime()

 */
