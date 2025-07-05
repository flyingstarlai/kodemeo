import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { asyncStoragePersister } from "@/main.tsx";

export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    // 1) cancel any in-flight queries
    await queryClient.cancelQueries();

    // 2) clear in-memory cache
    queryClient.clear();
    await queryClient.resetQueries();

    // 3) clear persisted cache (must await!)
    await asyncStoragePersister.removeClient();

    // 4) drop auth token
    localStorage.removeItem("token");

    // 5) redirect
    window.location.replace("/login");
  }, [queryClient]);
}
