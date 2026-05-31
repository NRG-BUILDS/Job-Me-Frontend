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
import { MessageCircle, Eye } from "lucide-react";

export default function SendFirstMessage({
  open,
  onChange,
}: {
  open: boolean;
  onChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [showChat, setShowChat] = useState(false);

  const chatMessage =
    name || location || service
      ? `Hi, I'm ${name || "[Your Name]"} from ${location || "[Your Location]"}. I'd like to ask: ${service || "[Service]"}.`
      : "";

  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Input Section */}
          <div className="border-gray-200 p-6 lg:border-r">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">Message Artisan</DialogTitle>
              <p className="mt-2 text-sm text-gray-600">
                Tell this artisan what you need help with.
              </p>
            </DialogHeader>

            <div className="space-y-4">
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
                className={`mt-6 w-full ${showChat ? "block" : "hidden lg:block"}`}
                size="lg"
                disabled={!name || !location || !service}
              >
                Send Your First Message
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
                This is how your message will appear
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

            {/* CTA Button - Desktop */}
            <Button
              className="mt-6 w-full lg:hidden"
              size="lg"
              disabled={!name || !location || !service}
            >
              Send Your First Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
