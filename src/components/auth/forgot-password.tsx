import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useRequest from "@/hooks/use-request";

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { makeRequest, loading } = useRequest("users/forgot-password", false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    await makeRequest({ email }, "POST").then(
      (res) => {
        console.log(res);
        if (res.status === 200) {
          console.log(res);
          // Navigate to OTP verification with information for password reset flow
          navigate("/auth/verify-otp", {
            state: {
              email,
              type: "reset-password",
              secret: res.secret, //the API returns a secret for verification
            },
          });
          toast({
            title: "Verification code sent",
            description: `A 6-digit code has been sent to ${email}`,
          });
        }
      },
      (err) => {
        toast({
          title: "Error",
          description: err.message || "Failed to send verification code",
          variant: "destructive",
        });
      },
    );
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground">
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </Button>
      </form>

      <button
        onClick={onBack}
        className="w-full text-sm text-primary hover:underline"
      >
        Back to login
      </button>
    </div>
  );
}
