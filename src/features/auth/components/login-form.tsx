import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LoginFormData } from "@/features/auth/types.ts";
import { loginSchema } from "@/features/auth/schema.ts";
import { useLogin } from "@/features/auth/hooks/use-login.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import welcome from "@/assets/login.png";
import React from "react";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate({ from: "/" });
  const login = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, { onSuccess: () => navigate({ to: "/dashboard" }) });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2  min-h-[500px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground text-balance">
                  Login as Teacher
                </p>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
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
                {login.isPending ? "Logging in…" : "Login as Teacher"}
              </Button>
              <div className="text-center text-sm">
                <Link
                  to={"/student/login"}
                  search={{ room: 0 }}
                  className="underline underline-offset-4"
                >
                  Login as <b>Student</b>
                </Link>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to={"/register"} className="underline underline-offset-4">
                  Sign up as <b>Teacher</b>
                </Link>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            {" "}
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
