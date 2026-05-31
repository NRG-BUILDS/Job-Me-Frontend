import React, { useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useOTPTimer } from "@/hooks/use-otp-timer";

interface OTPInputSectionProps {
  otp: string;
  setOtp: (value: string) => void;
}

export function OTPInputSection({ otp, setOtp }: OTPInputSectionProps) {
  const { expiryTime, resetTimers, formatTime } = useOTPTimer();

  // Restart the timer when component mounts
  useEffect(() => {
    resetTimers();
    // Empty dependency array to ensure this only runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={(value) => setOtp(value)}
        containerClassName="justify-center gap-2 md:gap-3"
        className="w-full"
      >
        <InputOTPGroup>
          <InputOTPSlot
            index={0}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
          <InputOTPSlot
            index={1}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
          <InputOTPSlot
            index={2}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
          <InputOTPSlot
            index={3}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
          <InputOTPSlot
            index={4}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
          <InputOTPSlot
            index={5}
            className="h-12 w-11 border-primary/50 dark:text-white sm:w-12"
          />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <p>
          {expiryTime > 0 ? (
            <>
              Code expires in{" "}
              <span className="font-medium text-primary">
                {formatTime(expiryTime)}
              </span>
            </>
          ) : (
            <>Code expired </>
          )}
        </p>
      </div>
    </div>
  );
}
