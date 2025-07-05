import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useLoginStudent } from "@/features/auth/hooks/use-login-student.ts";
import type { LoginStudentFormData } from "@/features/auth/types.ts";
import { loginStudentSchema } from "@/features/auth/schema.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import welcome from "@/assets/login.png";

export const LoginStudentForm: React.FC = () => {
  const { room } = useSearch({ strict: false });
  const navigate = useNavigate({ from: "/" });
  const login = useLoginStudent();

  const roomStr = room != null ? String(room) : "";
  const defaultCode = roomStr.length === 6 ? roomStr : "";
  const form = useForm<LoginStudentFormData>({
    resolver: zodResolver(loginStudentSchema),
    defaultValues: {
      code: defaultCode,
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginStudentFormData) => {
    login.mutate(
      {
        code: data.code,
        username: data.username,
        password: data.password,
      },
      { onSuccess: () => navigate({ to: "/student" }) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground text-balance">
                  Login as Student
                </p>
              </div>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classroom Code</FormLabel>
                    <FormControl>
                      <Input maxLength={6} placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={login.isPending}
              >
                {login.isPending ? "Logging in…" : "Login as Student"}
              </Button>

              <div className="text-center text-sm">
                <Link to={"/login"} className="underline underline-offset-4">
                  Login as <b>Teacher</b>
                </Link>
              </div>
            </form>
          </Form>

          <div className="bg-muted relative hidden md:block">
            <img
              src={welcome}
              alt="Welcome illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[1.5] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
