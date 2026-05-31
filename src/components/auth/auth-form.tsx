import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SocialAuthButtons } from "./social-auth-buttons";
import { AuthFormFields } from "./auth-form-fields";
import { ForgotPassword } from "./forgot-password";
import useRequest from "@/hooks/use-request";
import { login } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

export type LoginResponse = {
  user: {
    email: string;
    username: string | null;
    is_artisan: boolean;
  };
  token: string;
  notVerified?: boolean;
  status: number;
};

interface AuthFormProps {
  type: "login" | "signup";
  user: "client" | "artisan";
}

export function AuthForm({ type, user }: AuthFormProps) {
  const [step, setStep] = useState<"credentials" | "forgot-password">(
    "credentials",
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState(
    searchParams.get("invite") || null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { makeRequest, loading } = useRequest(
    type === "signup"
      ? "users/register"
      : type === "login"
        ? "users/login"
        : "",
    false,
  );
  const location = useLocation();
  // Extract the 'from' path from location state
  const from = location.state?.from || "/profile"; // Default fallback route

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Form validation
    if (!form.email || !form.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // api call
      await makeRequest({ ...form, referral_code: referralCode }, "POST").then(
        (res: LoginResponse) => {
          if (type === "login") {
            if (res.status === 200) {
              const payload = {
                token: res.token,
                email: res.user.email,
                user: res.user,
              };

              dispatch(login(payload));
              // Navigate to dashboard page
              navigate(from, { replace: true });
            }
          }
          if (type === "signup" && res.status === 201) {
            console.log("response", res);
            // Navigate to OTP verification page with email and type information
            navigate("/auth/verify-otp", {
              state: {
                email: form.email,
                type,
                from: from, // Pass the 'from' path to navigate back after verification
              },
            });

            toast({
              title: "Verification code sent",
              description: `A 6-digit code has been sent to ${form.email}`,
            });
          }
          return;
        },
        (err) => {
          console.log("Error is", err);
          if (err.notVerified) {
            navigate("/auth/verify-otp", {
              state: {
                email: form.email,
                secret: err.secret,
                type,
                from: from,
              },
            });
          }

          toast({
            variant: "destructive",
            description: err.message || "Error has occured",
          });
        },
      );
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "There was a problem with authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "forgot-password") {
    return <ForgotPassword onBack={() => setStep("credentials")} />;
  }

  return (
    <motion.div
      initial={{ scale: 1.05, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {type === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-muted-foreground">
            {type === "login"
              ? "Enter your credentials to sign in to your account"
              : "Enter your details to create a new account"}
          </p>
        </div>

        <div className="space-y-4">
          {/* {type === "login" && (
            <SocialAuthButtons referralCode={referralCode} onAuth={() => {}} />
          )} */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthFormFields
              form={form}
              setForm={setForm}
              type={type}
              user={"artisan"}
            />

            {type === "login" && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setStep("forgot-password")}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                  Processing...
                </span>
              ) : type === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            {type === "login" ? (
              <p>
                Don't have an account?{" "}
                <a href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AuthForm;
