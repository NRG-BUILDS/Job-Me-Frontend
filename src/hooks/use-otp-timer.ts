import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseOTPTimerProps {
  initialResendTime?: number;
  initialExpiryTime?: number;
}

export function useOTPTimer({
  initialResendTime = 60,
  initialExpiryTime = 10 * 60,
}: UseOTPTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState(initialResendTime);
  const [expiryTime, setExpiryTime] = useState(initialExpiryTime);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Timer for resend countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft]); // Added proper dependency

  // Timer for OTP expiry
  useEffect(() => {
    if (expiryTime > 0) {
      const timer = setTimeout(() => setExpiryTime(expiryTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (expiryTime === 0) {
      toast({
        title: "OTP Expired",
        description: "The OTP has expired. Please request a new one.",
        variant: "destructive",
      });
      setCanResend(true);
    }
  }, [expiryTime, toast]); // Added proper dependencies

  const resetTimers = () => {
    setCanResend(false);
    setTimeLeft(initialResendTime);
    setExpiryTime(initialExpiryTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    timeLeft,
    expiryTime,
    canResend,
    formatTime,
    resetTimers,
  };
}
