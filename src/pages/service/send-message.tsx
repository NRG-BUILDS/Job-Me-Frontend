import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Eye,
  CheckCircle2,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import useRequest from "@/hooks/use-request";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Offering = {
  title: string;
  price: number;
  _id: string;
};

interface BookArtisanProps {
  open: boolean;
  onChange: (open: boolean) => void;
  serviceId: string;
  artisanId: string;
  offerings: Offering[];
  serviceTitle: string;
}

export default function BookArtisan({
  open,
  onChange,
  serviceId,
  artisanId,
  offerings,
  serviceTitle,
}: BookArtisanProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(
    null,
  );

  const { makeRequest, loading } = useRequest("orders");
  const navigate = useNavigate();

  const chatMessage =
    name || location || service
      ? `Hi, I'm ${name || "[Your Name]"} from ${location || "[Your Location]"}. I'd like to ask: ${service || "[Service]"}.`
      : "";

  const canBook = selectedOffering !== null;

  const handleBook = async () => {
    if (!selectedOffering) {
      toast.error("Please select an offering to book.");
      return;
    }

    try {
      const body: Record<string, any> = {
        service: serviceId,
        artisan: artisanId,
        offering: {
          title: selectedOffering.title,
          price: selectedOffering.price,
        },
        amount: selectedOffering.price,
      };

      // Attach the initial message if the user filled out the fields
      if (name || location || service) {
        body.initial_message = {
          name: name || undefined,
          location: location || undefined,
          service_description: service || undefined,
        };
      }

      await makeRequest(body, "POST");
      toast.success("Booking placed!", {
        description: `Your booking for "${selectedOffering.title}" has been sent to the artisan.`,
        action: {
          label: "View Orders",
          onClick: () => navigate("/profile/orders"),
        },
      });
      onChange(false);
      // Reset form
      setName("");
      setLocation("");
      setService("");
      setSelectedOffering(null);
      setShowChat(false);
    } catch (err: any) {
      toast.error("Booking failed", {
        description: err?.error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Input Section */}
          <div className="max-h-[90vh] overflow-y-auto border-gray-200 p-6 lg:border-r">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">Book Artisan</DialogTitle>
              <p className="mt-2 text-sm text-gray-600">
                Select an offering and optionally introduce yourself to the
                artisan.
              </p>
            </DialogHeader>

            <div className="space-y-4">
              {/* Offering Selection */}
              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Select Offering <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  {offerings.map((o) => (
                    <button
                      key={o._id}
                      type="button"
                      onClick={() => setSelectedOffering(o)}
                      className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all ${
                        selectedOffering?._id === o._id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                            selectedOffering?._id === o._id
                              ? "border-primary bg-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedOffering?._id === o._id && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{o.title}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ₦{o.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">
                    Optional — introduce yourself
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="Mr. Bello"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location (Town or City)
                </Label>
                <Input
                  id="location"
                  placeholder="Egbeda, Lagos"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="service" className="text-sm font-medium">
                  What service would you like to ask about?
                </Label>
                <Textarea
                  id="service"
                  placeholder="do you do wall painting for..."
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-1.5 min-h-[100px] placeholder:text-gray-400"
                />
              </div>

              {/* Mobile View Button */}
              <Button
                variant="outline"
                className="w-full lg:hidden"
                onClick={() => setShowChat(!showChat)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showChat ? "Hide Preview" : "View Message Preview"}
              </Button>

              {/* CTA Button - shown on mobile only when chat is visible or on desktop always */}
              <Button
                className={`mt-6 w-full ${showChat ? "flex" : "hidden lg:flex"}`}
                size="lg"
                disabled={!canBook || loading}
                onClick={handleBook}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Booking…
                  </>
                ) : (
                  <>
                    <CalendarCheck className="mr-2 size-6" />
                    Book Artisan
                    {selectedOffering
                      ? ` — ₦${selectedOffering.price.toLocaleString()}`
                      : ""}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Chat Preview Section */}
          <div
            className={`bg-gray-50 p-6 ${showChat ? "block" : "hidden lg:block"}`}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Message Preview</h3>
              <p className="mt-1 text-sm text-gray-600">
                This is how your message will appear to the artisan
              </p>
            </div>

            <div className="flex min-h-[200px] items-start rounded-lg bg-white p-4 shadow-sm">
              {chatMessage ? (
                <div className="flex w-full gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                    {name.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="inline-block max-w-full rounded-2xl rounded-tl-none bg-secondary px-4 py-3 text-white">
                      <p className="text-sm leading-relaxed">{chatMessage}</p>
                    </div>
                    <p className="ml-1 mt-1 text-xs text-gray-500">Just now</p>
                  </div>
                </div>
              ) : (
                <div className="w-full py-8 text-center text-gray-400">
                  <MessageCircle className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p className="text-sm">
                    Fill in the fields to see your message preview
                  </p>
                </div>
              )}
            </div>

            {/* Booking summary */}
            {selectedOffering && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-sm font-semibold text-primary">
                  Booking Summary
                </h4>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span className="font-medium">{serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offering</span>
                    <span className="font-medium">
                      {selectedOffering.title}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-primary/10 pt-1">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">
                      ₦{selectedOffering.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button - Mobile duplicate */}
            <Button
              className="mt-6 w-full lg:hidden"
              size="lg"
              disabled={!canBook || loading}
              onClick={handleBook}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Booking…
                </>
              ) : (
                <>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Book Artisan
                  {selectedOffering
                    ? ` — ₦${selectedOffering.price.toLocaleString()}`
                    : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
