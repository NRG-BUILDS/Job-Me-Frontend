import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

/** Sub-page titles shown in the mobile back-bar */
const PAGE_TITLES: Record<string, string> = {
  "/profile/manage": "Account",
  "/profile/orders": "Orders",
  "/profile/support": "Support",
};

/** Wraps a mobile sub-page with a sticky back-nav header */
function MobileSubPageWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      {/* Back header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-white px-4 py-3">
        <button
          onClick={() => navigate("/profile", { replace: true })}
          className="rounded-full p-1 hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-semibold text-heading">{title}</h2>
      </div>
      {/* Page content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function ProfileLayout() {
  const [isMobile, setIsMobile] = useState(useIsMobile());
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const { data, makeRequest } = useRequest("users/get-profile");
  const {
    makeRequest: completeProfileRequest,
    loading: completeProfileLoading,
  } = useRequest("users/create-profile");

  // Mobile: index → tab list; sub-pages wrap with back-nav header
  const mobileRoutes = [
    {
      path: "/",
      component: <ProfileTabs profileData={data?.profile} />,
    },
    {
      path: "/manage",
      component: (
        <MobileSubPageWrapper>
          <ProfilePage profileData={data?.profile} />
        </MobileSubPageWrapper>
      ),
    },
    {
      path: "/orders",
      component: (
        <MobileSubPageWrapper>
          <OrdersPage />
        </MobileSubPageWrapper>
      ),
    },
  ];

  // Desktop: sidebar always shows tabs; index shows profile page directly
  const desktopRoutes = [
    { path: "/", component: <ProfilePage profileData={data?.profile} /> },
    { path: "/manage", component: <ProfilePage profileData={data?.profile} /> },
    { path: "/orders", component: <OrdersPage /> },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    makeRequest().catch((err: any) => {
      if (err?.status === 404 || err?.response?.status === 404) {
        setShowCompleteProfile(true);
      }
    });
  }, []);

  const handleCompleteProfile = async (formData: any) => {
    await completeProfileRequest(formData, "POST").then(
      () => toast("Profile updated successfully"),
      () => toast("Failed to update profile"),
    );
  };

  const formContent = (
    <div className="mt-6">
      <CompleteProfileForm
        isLoading={completeProfileLoading}
        onSubmit={async (formData) => {
          await handleCompleteProfile(formData);
          setShowCompleteProfile(false);
        }}
      />
    </div>
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

  /* ── Mobile: full-screen pages navigated via tab list ───────────────────── */
  if (isMobile) {
    return (
      <>
        <Routes>
          {mobileRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.component} />
          ))}
        </Routes>
        {completeProfileSheet}
      </>
    );
  }

  /* ── Desktop: sidebar + content area side-by-side ──────────────────────── */
  return (
    <main className="relative bg-[#f5f5f5] p-6">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid w-full gap-6 lg:grid-cols-12">
          <div className="relative h-full lg:col-span-3">
            <div className="sticky top-16">
              <ProfileTabs profileData={data?.profile} />
            </div>
          </div>
          <div className="w-full overflow-clip lg:col-span-9">
            <Routes>
              {desktopRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.component} />
              ))}
            </Routes>
          </div>
        </div>
      </div>
      {completeProfileSheet}
    </main>
  );
}
