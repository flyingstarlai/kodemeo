import React, { useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useGetLoginRoom } from "@/features/auth/hooks/use-get-login-room.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { StudentSeat } from "@/features/auth/components/student-seat.tsx";
import type { AxiosError } from "axios";
import { useLoginRoom } from "@/features/auth/hooks/use-login-room.ts";

const CARD_COLORS = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-purple-100",
];

export const JoinRoom: React.FC = () => {
  const { code } = useSearch({ strict: false });
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useGetLoginRoom(code);
  const loginMutation = useLoginRoom();
  const [username, setUsername] = useState<string | undefined>();

  const handleLogin = (username: string) => {
    if (!code) return;
    setUsername(username);
    loginMutation.mutate(
      { code, username },
      {
        onSuccess: async ({ token }) => {
          if (!token) return;

          await navigate({ to: "/dashboard" });
        },
      },
    );
  };

  if (!code) {
    return (
      <Card className="bg-indigo-100 animate-pulse">
        <CardContent className="flex items-center justify-center py-8">
          <span className="text-2xl font-light">
            Silakan minta kode login kelas kepada guru.
          </span>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="bg-indigo-100 animate-pulse">
        <CardContent className="flex items-center justify-center py-8">
          <span className="text-2xl font-light">
            Sedang menyiapkan bangku… 🐱‍👓
          </span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    const err = error as AxiosError;
    if (err.response?.status === 401) {
      return (
        <Card className="bg-yellow-100">
          <CardContent className="flex items-center justify-center py-8">
            <span className="text-2xl font-light text-yellow-800">
              Waktu sesi habis! ⏰<br />
              Silakan minta guru untuk membuat kode baru.
            </span>
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pilih Akun Murid</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {data?.map((stu, idx) => {
          const bgClass = CARD_COLORS[idx % CARD_COLORS.length];
          return (
            <StudentSeat
              key={stu.username}
              onLogin={handleLogin}
              isPending={loginMutation.isPending && stu.username === username}
              student={stu}
              bgClass={bgClass}
            />
          );
        })}
      </div>
    </div>
  );
};
