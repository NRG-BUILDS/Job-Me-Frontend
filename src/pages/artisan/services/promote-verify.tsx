import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import useRequest from "@/hooks/use-request";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VerifyPromotion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  // For mock checkout flow parameters
  const serviceId = searchParams.get("serviceId");
  const planId = searchParams.get("planId");

  const actualReference = reference || trxref;

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [activatedService, setActivatedService] = useState<any>(null);

  const { makeRequest: verifyPaystack } = useRequest(
    "artisans/promote/verify",
    true,
  );

  useEffect(() => {
    const handleVerify = async () => {
      if (!actualReference) {
        setStatus("error");
        setErrorDetails(
          "No payment reference found in the URL. Please contact support.",
        );
        return;
      }

      try {
        // Build url with reference and optional mock parameters
        let verifyUrl = `artisans/promote/verify?reference=${actualReference}`;
        if (serviceId && planId) {
          verifyUrl += `&serviceId=${serviceId}&planId=${planId}`;
        }

        const res = await verifyPaystack(
          null,
          "GET",
          "application/json",
          verifyUrl,
        );

        if (res?.success) {
          setStatus("success");
          setActivatedService(res.service);
        } else {
          setStatus("error");
          setErrorDetails(res?.message || "Transaction verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorDetails(
          err.message || "Failed to connect to the verification server.",
        );
      }
    };

    handleVerify();
  }, [actualReference]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
        {status === "verifying" && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              <div className="size-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-primary" />
            </div>
            <CardTitle className="mb-2 text-xl font-bold text-gray-900">
              Verifying Payment
            </CardTitle>
            <CardDescription className="max-w-xs text-sm text-gray-500">
              We are securely communicating with Paystack to confirm your
              transaction. Please do not close or refresh this window.
            </CardDescription>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="flex flex-col items-center border-b border-gray-100 bg-emerald-500/10 p-8">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
              <CardTitle className="mt-4 text-2xl font-black text-gray-950">
                Promotion Activated!
              </CardTitle>
              <CardDescription className="mt-1 text-sm font-semibold text-emerald-700">
                Your service is now boosted.
              </CardDescription>
            </div>

            <CardContent className="space-y-4 p-6">
              <div className="text-center text-sm leading-relaxed text-gray-600">
                Congratulations! Your service{" "}
                <strong>"{activatedService?.title || "Your Service"}"</strong>{" "}
                has been successfully promoted. It will now receive higher
                search priority rankings and rotational placement on our
                homepage features.
              </div>

              <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>PLAN TYPE</span>
                  <span className="capitalize text-gray-900">
                    {activatedService?.promotionPlan || "Spotlight"}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>EXPIRY DATE</span>
                  <span className="text-gray-900">
                    {activatedService?.promotionExpiresAt
                      ? new Date(
                          activatedService.promotionExpiresAt,
                        ).toLocaleDateString(undefined, { dateStyle: "long" })
                      : "Activated"}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>REFERENCE</span>
                  <span className="text-xxs max-w-[180px] truncate font-mono text-gray-900">
                    {actualReference}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 p-6 pt-0">
              <Button
                onClick={() => navigate("/artisan/dashboard")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-white hover:bg-primary/95"
              >
                Go to Artisan Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="flex flex-col items-center border-b border-gray-100 bg-red-500/10 p-8">
              <XCircle className="h-16 w-16 text-red-500" />
              <CardTitle className="mt-4 text-2xl font-black text-gray-950">
                Verification Failed
              </CardTitle>
              <CardDescription className="mt-1 text-sm font-semibold text-red-700">
                Something went wrong.
              </CardDescription>
            </div>

            <CardContent className="space-y-4 p-6 text-center">
              <p className="text-sm leading-relaxed text-gray-600">
                We couldn't confirm your transaction. This might be due to
                network timeout or payment cancellation.
              </p>
              {errorDetails && (
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 font-mono text-xs text-red-600">
                  {errorDetails}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 p-6 pt-0">
              <Button
                onClick={() => navigate("/artisan/skills/promote")}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 font-bold text-white hover:bg-gray-900"
              >
                <RefreshCw className="h-4 w-4" />
                Try Promotion Again
              </Button>
              <Link
                to="/artisan/dashboard"
                className="mt-2 block text-center text-sm font-semibold text-gray-500 hover:text-gray-950"
              >
                Return to Dashboard
              </Link>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
