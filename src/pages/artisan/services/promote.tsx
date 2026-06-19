import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Rocket, Zap, Check, Loader2 } from "lucide-react";
import useRequest from "@/hooks/use-request";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Service } from "@/types/service";

const PROMOTION_PLANS = [
  {
    id: "3days",
    name: "Quick Spark",
    duration: "3 Days",
    price: 500,
    icon: Zap,
    color: "from-amber-400 to-orange-500",
    badge: "Fast Results",
    description: "Perfect for testing the waters and getting quick bookings.",
    features: [
      "Ranked higher in search queries",
      "Standard priority placement",
      "View count metrics on dashboard",
      "Platform listing badge"
    ]
  },
  {
    id: "1week",
    name: "Growth Surge",
    duration: "1 Week",
    price: 1000,
    icon: Rocket,
    color: "from-emerald-400 to-teal-600",
    badge: "Most Popular",
    description: "Great for building a solid customer pipeline for a full week.",
    features: [
      "Ranked higher in search queries",
      "Homepage 'Featured Spotlights' rotation",
      "Advanced engagement analytics",
      "Platform listing badge",
      "Priority customer discovery recommendation"
    ]
  },
  {
    id: "1month",
    name: "Apex Spotlight",
    duration: "1 Month",
    price: 3500,
    icon: Sparkles,
    color: "from-indigo-500 to-purple-700",
    badge: "Maximum Reach",
    description: "Complete market domination. Keeps your skills booked all month.",
    features: [
      "Top tier search ranking priority",
      "Guaranteed homepage 'Featured Spotlights' placement",
      "Full premium analytics breakdown",
      "Gold Spotlight listing badge",
      "Priority placement in category pages",
      "Personalized platform recommendation"
    ]
  }
];

export default function PromoteService() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetServiceId = searchParams.get("serviceId");

  const [selectedServiceId, setSelectedServiceId] = useState<string>(targetServiceId || "");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("1week");
  const [services, setServices] = useState<Service[]>([]);

  const { makeRequest: fetchServices, loading: loadingServices } = useRequest("artisan/services", true);
  const { makeRequest: initPromotion, loading: initializingPayment } = useRequest("artisan/promote/initialize", true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await fetchServices();
        if (res?.success && res.services) {
          setServices(res.services);
          if (!selectedServiceId && res.services.length > 0) {
            setSelectedServiceId(res.services[0]._id);
          }
        }
      } catch (err: any) {
        toast.error("Failed to load your services", {
          description: err.message || "Please try again later."
        });
      }
    };
    getServices();
  }, []);

  const handleInitializePayment = async () => {
    if (!selectedServiceId) {
      toast.error("Please select a service to promote.");
      return;
    }
    if (!selectedPlanId) {
      toast.error("Please select a promotion plan.");
      return;
    }

    try {
      const res = await initPromotion({
        serviceId: selectedServiceId,
        planId: selectedPlanId
      }, "POST");

      if (res?.success && res.authorization_url) {
        toast.success("Redirecting to Paystack checkout...");
        // If it's a mock reference, append serviceId and planId so our mock verification page knows what to verify!
        if (res.isMock) {
          window.location.href = `${res.authorization_url}&serviceId=${selectedServiceId}&planId=${selectedPlanId}`;
        } else {
          window.location.href = res.authorization_url;
        }
      } else {
        toast.error("Failed to initialize payment", {
          description: res?.message || "Please check your network connection."
        });
      }
    } catch (err: any) {
      toast.error("Payment initialization error", {
        description: err.message || "Something went wrong."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/artisan/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            🚀 Skill Booster
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Boost Your Service Visibility
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your growth targets. Promoted skills get prime placements, higher rankings, and more customer leads.
          </p>
        </div>

        {/* Form and Selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-10">
          <div className="max-w-xl mx-auto mb-8">
            <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-2">
              Which skill do you want to boost?
            </label>
            {loadingServices ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading your services...
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">You haven't created any services yet.</p>
                <Link to="/artisan/skills/new" className="text-sm font-semibold text-primary hover:underline">
                  Create a Service
                </Link>
              </div>
            ) : (
              <select
                id="service-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              >
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.title} ({service.category?.name})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROMOTION_PLANS.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative flex flex-col justify-between rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? "border-primary bg-primary/[0.02] shadow-sm scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <span className={`absolute -top-3 right-6 rounded-full bg-gradient-to-r ${plan.color} px-3 py-0.5 text-xxs font-bold uppercase tracking-wider text-white shadow-md`}>
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} text-white shadow-sm`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{plan.name}</h3>
                        <p className="text-sm text-gray-500 font-semibold">{plan.duration}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-black text-gray-900">₦{plan.price.toLocaleString()}</span>
                      <span className="text-gray-500 text-sm font-medium"> / {plan.duration}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mb-6" />

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <Check className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Radio selector indicator */}
                  <div className="mt-auto">
                    <div className={`w-full py-2.5 rounded-xl text-center text-sm font-bold border transition-colors ${
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}>
                      {isSelected ? "Selected" : "Choose Plan"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Checkout Actions */}
        <div className="flex flex-col items-center gap-4 bg-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold">Secure checkout with Paystack</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-lg">
              You will be redirected to the secure Paystack portal to complete the transaction. Your promotion plan starts immediately upon payment confirmation.
            </p>
          </div>
          <Button
            size="lg"
            onClick={handleInitializePayment}
            disabled={initializingPayment || services.length === 0}
            className="w-full sm:w-auto min-w-[220px] bg-primary text-white hover:bg-primary/95 text-base font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 transition-all"
          >
            {initializingPayment ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Initializing...
              </>
            ) : (
              `Promote Service • ₦${PROMOTION_PLANS.find(p => p.id === selectedPlanId)?.price.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
