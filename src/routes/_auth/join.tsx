import { createFileRoute } from "@tanstack/react-router";
import { JoinRoom } from "@/features/auth/components/join-room.tsx";

type RoomLogin = {
  code?: string;
  redirect?: string;
};

export const Route = createFileRoute("/_auth/join")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): RoomLogin => {
    return {
      code: search.code as string,
      redirect: search.redirect as string,
    };
  },
});

function RouteComponent() {
  return (
    <div className="w-full  max-w-6xl ">
      <JoinRoom />
    </div>
  );
}
