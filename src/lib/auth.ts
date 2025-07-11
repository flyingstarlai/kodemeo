/**
 * Returns true if we have a valid, unexpired JWT saved in localStorage.
 */

export interface UserPayload {
  sub: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  exp: number;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserFromToken(): UserPayload | null {
  const token = getToken();
  if (!token) return null;
  try {
    const [, payloadB64] = token.split(".");
    const payloadJson = atob(payloadB64);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const user = getUserFromToken();
  if (!user) return false;
  return !!user && user.exp * 1000 > Date.now();
}

