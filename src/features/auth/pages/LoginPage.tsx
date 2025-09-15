import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { AspectRatio } from "../../../components/ui/aspect-ratio"

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      setIsLoading(false)
      navigate("/")
    }, 700)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Welcome back! Please sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto mb-4 w-[160px] h-[160px] p-2 items-center">
          <AspectRatio ratio={1}>
            <img src="/logo.png" alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </div>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="usernameOrEmail">Email or Username</Label>
              <Input id="usernameOrEmail" name="usernameOrEmail" type="text" placeholder="m@example.com or johndoe" required disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isLoading} />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link to="/auth/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
          <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
            Stay Chat with Log out
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account? {" "}
            <Link to="/auth/register" className="text-primary hover:underline underline-offset-4">Register</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
