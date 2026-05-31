import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProfileSettings({
  profileData,
}: {
  profileData?: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    onlineStatus: "GO OFFLINE FOR...",
    deactivationReason: "",
    phone_number: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        fullName: profileData.user?.first_name
          ? `${profileData.user.first_name} ${profileData.user.last_name || ""}`.trim()
          : prev.fullName,
        email: profileData.user?.email || prev.email,
        phone_number: profileData.phone_number || prev.phone_number,
        street: profileData.street || prev.street,
        city: profileData.city || prev.city,
        state: profileData.state || prev.state,
        country: profileData.country || prev.country,
      }));
    }
  }, [profileData]);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl rounded border border-border/50 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-end">
          <div className="mb-6 text-sm text-gray-600">
            Need to update your artisan profile?{" "}
            <a href="#" className="text-emerald-500 hover:text-emerald-600">
              Go to Artisan Dashboard
            </a>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mb-8 space-y-6">
          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="fullName"
              className="text-right font-medium text-gray-700"
            >
              FULL NAME
            </Label>
            <div className="col-span-3">
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="email"
              className="text-right font-medium text-gray-700"
            >
              EMAIL
            </Label>
            <div className="col-span-3">
              <Input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="phone_number"
              className="text-right font-medium text-gray-700"
            >
              PHONE NUMBER
            </Label>
            <div className="col-span-3">
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="street"
              className="text-right font-medium text-gray-700"
            >
              STREET ADDRESS
            </Label>
            <div className="col-span-3">
              <Input
                id="street"
                value={formData.street}
                onChange={(e) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* City */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="city"
              className="text-right font-medium text-gray-700"
            >
              CITY
            </Label>
            <div className="col-span-3">
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* State & Country */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="state"
              className="text-right font-medium text-gray-700"
            >
              STATE / PROVINCE
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
              <Input
                id="country"
                placeholder="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                disabled={!isEditing}
                className="w-full disabled:cursor-default disabled:opacity-100"
              />
            </div>
          </div>

          {/* Online Status */}
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="text-right">
              <Label className="flex items-center justify-end gap-2 font-medium text-gray-700">
                ONLINE STATUS
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </Label>
              <p className="mt-1 text-xs text-gray-500">
                When online, your Gigs are visible under the Online search
                filter.
              </p>
            </div>
            <div className="col-span-3">
              <Select
                value={formData.onlineStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, onlineStatus: value })
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full disabled:cursor-default disabled:opacity-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GO OFFLINE FOR...">
                    GO OFFLINE FOR...
                  </SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Edit/Save Button */}
        {!isEditing ? (
          <div className="mb-8 flex justify-end">
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-emerald-500 px-8 text-white hover:bg-emerald-600"
            >
              Edit Profile
            </Button>
          </div>
        ) : (
          <div className="mb-8 flex justify-end gap-3">
            <Button onClick={handleCancel} variant="outline" className="px-6">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-500 px-8 text-white hover:bg-emerald-600"
            >
              Save Changes
            </Button>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Account Deactivation Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right font-medium text-gray-700">
              ACCOUNT DEACTIVATION
            </Label>
            <div className="col-span-3">
              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertDescription className="text-sm text-gray-700">
                  <p className="mb-2 font-semibold">
                    What happens when you deactivate your account?
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>
                      • Your profile and Gigs won't be shown on Job&Me anymore.
                    </li>
                    <li>• Active orders will be cancelled.</li>
                    <li>• You won't be able to re-activate your Gigs.</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Deactivation Reason */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right text-gray-700">
              I'm leaving because...
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.deactivationReason}
                onValueChange={(value) =>
                  setFormData({ ...formData, deactivationReason: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-satisfied">
                    Not satisfied with service
                  </SelectItem>
                  <SelectItem value="too-expensive">Too expensive</SelectItem>
                  <SelectItem value="found-alternative">
                    Found an alternative
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deactivate Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Deactivate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
