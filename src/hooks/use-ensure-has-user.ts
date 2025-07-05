import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/features/me/types";
import { useLogout } from "@/features/auth/hooks/use-logout.ts";
import { queryKeys } from "@/lib/query-keys.ts";

/**
 * Hook that will automatically log the me out if there is no me in cache.
 * Call this in any component (e.g. your App or protected routes) to enforce auth guard.
 */
export function useEnsureHasUser() {
  const qc = useQueryClient();
  const logout = useLogout();

  // Read me from cache. `undefined` means not logged in / no data.
  const user = qc.getQueryData<User>(queryKeys.user);

  if (!user) logout().catch((err) => console.error(err));

  useEffect(() => {
    if (user === undefined) {
      // No me in cache → log out (clear tokens, redirect)
      logout().catch((err) => console.error(err));
    }
  }, [user, logout]);

  return user;
}
