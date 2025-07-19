import { Card, CardContent } from "@/components/ui/card.tsx";
import { IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button.tsx";
import type { RoomLogin } from "@/features/auth/types.ts";

interface StudentSeatProps {
  onLogin: (username: string) => void;
  isPending: boolean;
  student: RoomLogin;
  bgClass: string;
}

export const StudentSeat: React.FC<StudentSeatProps> = ({
  onLogin,
  isPending,
  student,
  bgClass,
}) => {
  return (
    <Card className={`${bgClass} hover:shadow-lg transition-shadow `}>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow">
          <IconUser className="size-8 text-gray-400" />
        </div>
        <div className="text-lg font-semibold">{student.name}</div>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          className="cursor-pointer"
          onClick={() => onLogin(student.username)}
        >
          {isPending ? "Menuju kelas..." : "Masuk"}
        </Button>
      </CardContent>
    </Card>
  );
};
