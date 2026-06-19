import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useRequest from "@/hooks/use-request";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Star,
  ArrowLeft,
  CheckCircle2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface ReviewLocationState {
  orderId: string;
  serviceId: string;
  serviceName: string;
  artisanName: string;
  amount?: number;
  offeringTitle?: string;
  serviceImage?: string;
  gallery?: { url: string }[];
}

export default function LeaveReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ReviewLocationState | null;

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderCardOpen, setOrderCardOpen] = useState(false);

  const { makeRequest: submitReview, loading } = useRequest<any>("", true);

  // If navigated to without state, redirect back
  if (!state?.orderId || !state?.serviceId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-semibold text-muted-foreground">
          No order data found. Please go back to your orders.
        </p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => navigate("/profile/orders")}
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to Orders
        </Button>
      </div>
    );
  }

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review");
      return;
    }

    try {
      const res = await submitReview(
        {
          service: state.serviceId,
          order: state.orderId,
          rating,
          review: reviewText.trim(),
        },
        "POST",
        "application/json",
        `reviews/${state.serviceId}/create`,
      );

      if (res && res.success) {
        setSubmitted(true);
      } else {
        toast.error(res?.error || "Failed to submit review");
      }
    } catch (err: any) {
      toast.error(err?.error || "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-heading">
            Thank you for your review!
          </h1>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            Your feedback helps the community choose the right artisans. It's
            been posted on{" "}
            <span className="font-semibold text-dark">{state.serviceName}</span>
            .
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-full font-semibold"
            onClick={() => navigate("/profile/orders")}
          >
            Back to Orders
          </Button>
          <Button
            className="rounded-full bg-dark font-semibold hover:bg-dark/90"
            onClick={() => navigate("/")}
          >
            Explore More Services
          </Button>
        </div>
      </div>
    );
  }

  const activeRating = hovered || rating;

  // ── Initials for avatar fallback ──────────────────────────────────────────
  const initials = state.artisanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ── Service Detail Card ───────────────────────────────────────────────────
  const ServiceDetailCard = () => (
    <div className="flex h-full flex-col gap-6 p-8 lg:p-12">
      {/* Service Image / Banner */}
      {state.gallery && state.gallery.length > 0 ? (
        <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
          <img
            src={state.gallery[0].url}
            alt={state.serviceName}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-white/20 shadow-inner">
          <Star size={64} className="text-white/50" />
        </div>
      )}

      {/* Service Info */}
      <div className="space-y-4">
        {state.offeringTitle && (
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {state.offeringTitle}
          </span>
        )}
        <h2 className="text-2xl font-extrabold leading-snug text-white lg:text-3xl">
          {state.serviceName}
        </h2>

        {/* Artisan */}
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/25 text-sm font-extrabold text-white">
            {initials || <User size={16} />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Artisan
            </p>
            <p className="font-bold text-white">{state.artisanName}</p>
          </div>
        </div>

        {/* Price */}
        {state.amount != null && (
          <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Amount Paid
            </p>
            <p className="text-2xl font-extrabold text-white">
              {formatMoney(state.amount)}
            </p>
          </div>
        )}
      </div>

      {/* Decorative stars */}
      <div className="mt-auto flex gap-1 opacity-30">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} size={18} className="fill-white text-white" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* ── LEFT PANEL (desktop only) ───────────────────────────────────── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-primary lg:block">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 size-80 rounded-full bg-white/10 blur-3xl" />
        <ServiceDetailCard />
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-8 lg:px-12 lg:py-12">
        {/* Back link */}
        <button
          onClick={() => navigate("/profile/orders")}
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-dark"
        >
          <ArrowLeft size={14} /> Back to Orders
        </button>

        {/* ── MOBILE: collapsible order card ─────────────────────────── */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-primary lg:hidden">
          {/* Toggle header */}
          <button
            type="button"
            onClick={() => setOrderCardOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                Service
              </p>
              <p className="truncate font-bold text-white">
                {state.serviceName}
              </p>
            </div>
            <div className="ml-3 shrink-0 text-white">
              {orderCardOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>
          </button>

          {/* Expanded content */}
          {orderCardOpen && (
            <div className="border-t border-white/20">
              <ServiceDetailCard />
            </div>
          )}
        </div>

        {/* ── REVIEW FORM ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-lg space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-primary">
              Leave a Review
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              How was your experience with{" "}
              <span className="font-bold text-dark">{state.artisanName}</span>{" "}
              on{" "}
              <span className="font-bold text-dark">{state.serviceName}</span>?
            </p>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Your Rating
            </label>
            <div
              className="flex items-center gap-2"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    size={40}
                    className={`transition-colors ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <p className="text-sm font-bold text-amber-600 duration-150 animate-in fade-in-50">
                {ratingLabels[activeRating]}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Your Review
            </label>
            <Textarea
              placeholder={`Tell others about your experience working with ${state.artisanName}. What went well? Would you hire them again?`}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="resize-none font-medium focus-visible:ring-primary"
            />
            <p className="text-right text-xs text-muted-foreground">
              {reviewText.length} / 500 characters
              {reviewText.length < 10 && reviewText.length > 0 && (
                <span className="ml-1 text-rose-500">(min 10)</span>
              )}
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full font-semibold"
              onClick={() => navigate("/profile/orders")}
              disabled={loading}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="flex-1 rounded-full bg-amber-500 font-semibold hover:bg-amber-500/90"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
