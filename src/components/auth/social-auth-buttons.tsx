import { Button } from "@/components/ui/button";
import CustomGoogleButton from "./google-button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginResponse } from "./auth-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { login } from "@/store/authSlice";

interface SocialAuthButtonsProps {
  onAuth: (provider: string) => void;
  referralCode: string | null;
}

export function SocialAuthButtons({ referralCode }: SocialAuthButtonsProps) {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const hostname = window.location.hostname;

  // Extract the 'from' path from location state
  const from = location.state?.from?.pathname || "/dashboard"; // Default fallback route

  const handleLoginSuccess = (res: LoginResponse) => {
    console.log("Successfully authenticated user");
    const payload = {
      token: res.data.access,
      refresh: res.data.refresh,
      username: res.data.user.username,
      email: null,
      user: res.data.user,
    };
    dispatch(login(payload));
    if (!res.data.user.isOnboarded) {
      navigate("/auth/onboarding", { replace: true });
      return;
    }
    // Handle successful login - e.g., redirect to dashboard
    navigate(from, { replace: true });
  };

  const handleLoginError = (error: Error) => {
    // Handle login errors - show error message to user
    console.error("Login error:", error.message);
    toast.error(error.message, {
      description: "Please try again or contact support.",
    });
  };

  return (
    <div className="space-y-4">
      <CustomGoogleButton
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
        baseUrl={baseUrl}
        referralCode={referralCode}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}
