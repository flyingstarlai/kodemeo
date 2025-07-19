import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryDataByKey } from "@/lib/query-keys.ts";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const qc = useQueryClient();
  const me = getQueryDataByKey(qc, "user");
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10">
      <Card className=" animate-pulse border-none">
        <CardContent className="flex items-center justify-center py-8">
          <span className="text-2xl font-light">Hai, {me?.name} 🐱‍👓</span>
        </CardContent>
      </Card>
    </div>
  );
}
