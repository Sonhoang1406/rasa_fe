import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { Link } from "react-router-dom"

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
    }, 700)
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email verified</CardTitle>
          <CardDescription>Your account has been activated.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm"><Link to="/auth" className="text-primary hover:underline">Go to login</Link></p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>Enter the 6-digit code we sent to your email</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input id="code" name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} placeholder="123456" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Verifying..." : "Verify"}</Button>
          <p className="text-center text-sm text-gray-600">Didn't get the code? <button type="button" className="text-primary hover:underline">Resend</button></p>
        </form>
      </CardContent>
    </Card>
  )
}
