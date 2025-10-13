import { ThemeProvider } from "@/components";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useVerify } from "@/hooks/useVerify";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function VerifyPage() {
  const { verify, isLoading } = useVerify();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "error" | "success"
  >("idle");
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const type = location.state?.type; // "register" hoặc "forgot"
  const token = location.state?.token;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setVerificationStatus("error");
      setPopupMessage("Verification code cannot be empty");
      setIsPopupOpen(true);
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verify(otp); 
      if (!result || result.success === false) {
        const msg = result?.message || "Verification failed";
        throw new Error(msg);
      }

      setVerificationStatus("success");
      setPopupMessage("Verification successful! Redirecting...");
      setIsPopupOpen(true);
      await sleep(1200);

      if (type === "forgot") {
        navigate("/auth/reset-password", { state: { token } });
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      setVerificationStatus("error");
      setPopupMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsPopupOpen(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-32 w-32 mx-auto mb-10"
              />
              <h1 className="text-2xl font-bold tracking-tight">
                Verify your {type === "forgot" ? "password reset" : "account"}
              </h1>
              <p className="text-muted-foreground">
                Enter the verification code sent to your email.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="verification-code"
                  className="text-sm font-medium"
                >
                  Verification code
                </label>
                <Input
                  id="verification-code"
                  placeholder="Enter verification code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isVerifying || verificationStatus === "success"}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FC6D26] hover:bg-[#E24329] text-white"
                disabled={isLoading}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </div>
        </main>

        <footer className="py-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 KMA
        </footer>
      </div>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent>
          <DialogTitle>
            {verificationStatus === "success" ? "Success" : "Error"}
          </DialogTitle>
          <p>{popupMessage}</p>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
