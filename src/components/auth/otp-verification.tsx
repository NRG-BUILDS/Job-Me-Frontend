import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useOTPTimer } from "@/hooks/use-otp-timer";
import { OTPInputSection } from "./otp-input-section";
import useRequest from "@/hooks/use-request";

interface OTPVerificationProps {
  email: string;
  secret: string;
  redirectPath: string;
  onBack: () => void;
}

export function OTPVerification({
  email,
  redirectPath,
  secret,
  onBack,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { makeRequest, loading } = useRequest("users/otp/verify", false);
  const { makeRequest: resendOtpRequest, loading: resendOtpLoading } =
    useRequest("users/password/reset/", false);

  const { timeLeft, expiryTime, canResend, formatTime, resetTimers } =
    useOTPTimer();

  const handleResendOTP = async () => {
    setIsLoading(true);

    resendOtpRequest({ email }, "POST")
      .then(() => {
        toast({
          title: "OTP Resent",
          description: `A new verification code has been sent to ${email}`,
        });

        resetTimers();
      })
      .catch((err) => {
        toast({
          title: "Failed to resend OTP.",
          description: err.message || "Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    await makeRequest({ secret, otp }, "POST").then(
      (res) => {
        if (res.status === "success") {
          toast({
            title: "Verification Successful",
            description: "Your account has been verified successfully",
          });

          navigate(redirectPath);
        }
      },
      (err) => {
        toast({
          title: "Verification Failed",
          description: err.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    );

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            We've sent a 4-digit verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <OTPInputSection otp={otp} setOtp={setOtp} />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Code expires in{" "}
              <span className="font-medium">{formatTime(expiryTime)}</span>
            </p>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-NextNest-purple-500 hover:bg-NextNest-purple-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <span>Verify</span>
            )}
          </Button>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-NextNest-purple-500 hover:underline"
                  disabled={isLoading}
                >
                  Resend
                </button>
              ) : (
                <span>Resend in {timeLeft}s</span>
              )}
            </p>

            <button
              onClick={onBack}
              className="text-sm text-NextNest-purple-500 hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default OTPVerification;
