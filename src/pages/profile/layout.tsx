// ChatLayout.jsx
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import ProfileTabs from "./tab-list";
import ProfilePage from ".";
import OrdersPage from "./orders";
import useRequest from "@/hooks/use-request";
import { CompleteProfileForm } from "@/components/profile/complete-profile-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const useIsMobile = () => window.innerWidth < 768;

export default function ProfileLayout() {
  const [isMobile, setIsMobile] = useState(useIsMobile());
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const { data, makeRequest, loading } = useRequest("users/get-profile");
  const {
    makeRequest: completeProfileRequest,
    loading: completeProfileLoading,
  } = useRequest("users/create-profile");
  const routes = [
    {
      path: "/",
      component: isMobile ? (
        <ProfileTabs profileData={data?.profile} />
      ) : (
        <ProfilePage profileData={data?.profile} />
      ),
    },
    { path: "/manage", component: <ProfilePage profileData={data?.profile} /> },
    { path: "/orders", component: <OrdersPage /> },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    makeRequest()
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
        if (err?.status === 404 || err?.response?.status === 404) {
          setShowCompleteProfile(true);
        }
      });
  }, []);

  const handleCompleteProfile = async (data: any) => {
    await completeProfileRequest(data, "POST").then(
      (res) => {
        console.log(res);
        toast("Profile updated successfully");
      },
      (err) => {
        console.log(err);
        toast("Failed to update profile");
      },
    );
  };

  const formContent = (
    <>
      <div className="mt-6">
        <CompleteProfileForm
          isLoading={completeProfileLoading}
          onSubmit={async (data) => {
            await handleCompleteProfile(data);
            setShowCompleteProfile(false);
          }}
        />
      </div>
    </>
  );

  const completeProfileSheet = isMobile ? (
    <Sheet open={showCompleteProfile} onOpenChange={setShowCompleteProfile}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[90vh] overflow-y-auto rounded-t-2xl sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle>Complete Your Profile</SheetTitle>
          <SheetDescription>
            Please provide your details to complete your profile setup.
          </SheetDescription>
        </SheetHeader>
        {formContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={showCompleteProfile} onOpenChange={setShowCompleteProfile}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your details to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );

  if (isMobile) {
    return (
      <>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
        </Routes>
        {completeProfileSheet}
      </>
    );
  }

  // Desktop layout: show both side by side
  return (
    <main className="relative bg-[#f5f5f5] p-6">
      <div className="relative mx-auto flex h-full min-h-screen max-w-7xl flex-none items-start gap-10 *:transition-all *:duration-500">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="relative h-full lg:col-span-3">
            <div className="sticky top-16">
              <ProfileTabs profileData={data?.profile} />
            </div>
          </div>
          <div className={`w-full overflow-clip lg:col-span-9`}>
            <Routes>
              {routes.map((route) => (
                <Route path={route.path} element={route.component} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
      {completeProfileSheet}
    </main>
  );
}
