import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import useRequest from "@/hooks/use-request";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function VerifyPromotion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");
  
  // For mock checkout flow parameters
  const serviceId = searchParams.get("serviceId");
  const planId = searchParams.get("planId");

  const actualReference = reference || trxref;

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [activatedService, setActivatedService] = useState<any>(null);

  const { makeRequest: verifyPaystack } = useRequest("artisan/promote/verify", true);

  useEffect(() => {
    const handleVerify = async () => {
      if (!actualReference) {
        setStatus("error");
        setErrorDetails("No payment reference found in the URL. Please contact support.");
        return;
      }

      try {
        // Build url with reference and optional mock parameters
        let verifyUrl = `artisan/promote/verify?reference=${actualReference}`;
        if (serviceId && planId) {
          verifyUrl += `&serviceId=${serviceId}&planId=${planId}`;
        }

        const res = await verifyPaystack(
          null,
          "GET",
          "application/json",
          verifyUrl
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
        setErrorDetails(err.message || "Failed to connect to the verification server.");
      }
    };

    handleVerify();
  }, [actualReference]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-gray-100 shadow-xl bg-white rounded-2xl overflow-hidden">
        {status === "verifying" && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
              <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Loader2 className="h-6 w-6 text-primary absolute inset-0 m-auto animate-pulse" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 max-w-xs">
              We are securely communicating with Paystack to confirm your transaction. Please do not close or refresh this window.
            </CardDescription>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="bg-emerald-500/10 p-8 flex flex-col items-center border-b border-gray-100">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
              <CardTitle className="text-2xl font-black text-gray-950 mt-4">
                Promotion Activated!
              </CardTitle>
              <CardDescription className="text-emerald-700 font-semibold text-sm mt-1">
                Your service is now boosted.
              </CardDescription>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-gray-600 leading-relaxed text-center">
                Congratulations! Your service <strong>"{activatedService?.title || 'Your Service'}"</strong> has been successfully promoted. 
                It will now receive higher search priority rankings and rotational placement on our homepage features.
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>PLAN TYPE</span>
                  <span className="text-gray-900 capitalize">{activatedService?.promotionPlan || "Spotlight"}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>EXPIRY DATE</span>
                  <span className="text-gray-900">
                    {activatedService?.promotionExpiresAt 
                      ? new Date(activatedService.promotionExpiresAt).toLocaleDateString(undefined, { dateStyle: "long" })
                      : "Activated"}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>REFERENCE</span>
                  <span className="text-gray-900 font-mono text-xxs truncate max-w-[180px]">{actualReference}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex flex-col gap-2">
              <Button
                onClick={() => navigate("/artisan/dashboard")}
                className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2"
              >
                Go to Artisan Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="bg-red-500/10 p-8 flex flex-col items-center border-b border-gray-100">
              <XCircle className="h-16 w-16 text-red-500" />
              <CardTitle className="text-2xl font-black text-gray-950 mt-4">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-red-700 font-semibold text-sm mt-1">
                Something went wrong.
              </CardDescription>
            </div>

            <CardContent className="p-6 text-center space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                We couldn't confirm your transaction. This might be due to network timeout or payment cancellation.
              </p>
              {errorDetails && (
                <div className="bg-red-50/50 rounded-xl p-3 border border-red-100 text-xs font-mono text-red-600">
                  {errorDetails}
                </div>
              )}
            </CardContent>

            <CardFooter className="p-6 pt-0 flex flex-col gap-2">
              <Button
                onClick={() => navigate("/artisan/skills/promote")}
                className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Promotion Again
              </Button>
              <Link to="/artisan/dashboard" className="text-center text-sm font-semibold text-gray-500 hover:text-gray-950 mt-2 block">
                Return to Dashboard
              </Link>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
