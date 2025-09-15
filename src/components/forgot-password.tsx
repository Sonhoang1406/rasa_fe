"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Replace with your actual password reset logic
    console.log("Password reset for:", email);
    setSuccess(true);
    setError(null);
  };

  const handleOnclickContinueResetPass = () => {
    navigate("/auth/reset-password", {
      state: {
        email: email,
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            {success
              ? "Check your email for a reset link"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mx-auto mb-4 w-[160px] h-[160px] p-2 items-center">
            <AspectRatio ratio={1}>
              <img
                src="/logo.png"
                alt="Image"
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          {success ? (
            <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md ">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your email
              <div className="mt-8 flex justify-center">
                <Button onClick={handleOnclickContinueResetPass}>
                  Continue to reset password
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link to="/auth" className="underline underline-offset-4">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
