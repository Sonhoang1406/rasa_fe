import { Button } from "@/components/ui/button";
import { authService } from "../api/service";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LoginPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     await login({ usernameOrEmail, password });
  //   } catch (err: any) {
  //     setError(
  //       err.response?.data?.message ||
  //         "Login failed. Please check your credentials."
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const handleStayChat = () => {
  //   navigate("/");
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email or username to login to your account
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

          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label>Email or Username</Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder="m@example.com or johndoe"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label>Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                // onClick={handleStayChat}
                disabled={isSubmitting}
              >
                Stay Chat with Log out
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
