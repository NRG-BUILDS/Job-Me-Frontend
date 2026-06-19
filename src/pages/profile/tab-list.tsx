import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ExternalLink, Settings, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRequest from "@/hooks/use-request";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateUserRole } from "@/store/authSlice";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/** Page titles shown in the mobile header when inside a sub-route */
const PAGE_TITLES: Record<string, string> = {
  "/profile/manage": "Account",
  "/profile/orders": "Orders",
  "/profile/support": "Support",
};

const ProfileTabs = ({ profileData }: { profileData: any }) => {
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState(profileData?.user?.first_name);
  const [lastName, setLastName] = useState(profileData?.user?.last_name);
  const isArtisan = useSelector(
    (state: RootState) => state.auth.user?.is_artisan,
  );
  const [openPromoteDialog, setOpenPromoteDialog] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { makeRequest: promoteUser, loading: isPromoting } = useRequest(
    "artisans/promote",
    true,
  );

  /** On mobile, Account navigates to /profile/manage (ProfilePage).
   *  On desktop the tabs live in the sidebar — Account highlights /profile. */
  const routes = [
    { path: isMobile ? "/profile/manage" : "/profile", label: "Account" },
    { path: "/profile/orders", label: "Orders" },
    { path: "/profile/support", label: "Support" },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  /** True when the user is on a sub-page (mobile only scenario) */
  const isSubPage =
    isMobile && Object.keys(PAGE_TITLES).includes(location.pathname);

  useEffect(() => {
    setFirstName(profileData?.user?.first_name);
    setLastName(profileData?.user?.last_name);
    dispatch(updateUserRole({ is_artisan: profileData?.user?.is_artisan }));
  }, [profileData]);

  const handlePromote = async () => {
    try {
      await promoteUser(null, "PATCH");
      toast.success("Success", {
        description: "You have been successfully promoted to an Artisan!",
      });
      dispatch(updateUserRole({ is_artisan: true }));
      setOpenPromoteDialog(false);
    } catch (error: any) {
      toast.error("Promotion failed", {
        description: error?.message || "An error occurred while promoting.",
      });
    }
  };

  /* ─── Mobile: sub-page back-header ─────────────────────────────────────── */
  if (isSubPage) {
    return (
      <div className="border-b border-border bg-white">
        <button
          onClick={() => navigate("/profile", { replace: true })}
          className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-heading"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="border-t border-border px-4 py-3">
          <h2 className="text-base font-semibold text-heading">
            {PAGE_TITLES[location.pathname]}
          </h2>
        </div>
      </div>
    );
  }

  /* ─── Main tab list (mobile index page OR desktop sidebar) ─────────────── */
  return (
    <div className="bg-white px-4">
      {/* Profile header */}
      <div className="flex items-center justify-between border-b border-border py-4">
        <div className="flex items-center gap-2">
          <div className="grid size-14 place-items-center rounded-full bg-dark text-lg font-extrabold text-white">
            <p>
              {firstName?.[0]}
              {lastName?.[0]}
            </p>
          </div>
          <h3 className="text-lg font-semibold">
            {firstName} {lastName}
          </h3>
        </div>
        <button className="rounded-full p-1 hover:bg-muted">
          <Settings />
        </button>
      </div>

      {/* Nav items */}
      <div className="grid gap-y-1 py-4">
        {routes.map((route) => (
          <button
            key={route.path}
            onClick={() => navigate(route.path, { replace: true })}
            className={`block w-full rounded-md p-4 text-left hover:font-semibold hover:!text-heading ${
              location?.pathname === route.path
                ? "cursor-default bg-muted font-bold text-heading hover:font-bold"
                : isMobile
                  ? "text-lg font-medium shadow-elevate-01 hover:bg-primary/10"
                  : ""
            }`}
          >
            {route.label}
          </button>
        ))}

        {/* Artisan Dashboard / Become an Artisan */}
        {isArtisan ? (
          <button
            onClick={() => navigate("/artisan/dashboard", { replace: true })}
            className={`flex w-full items-center gap-2 rounded-md p-4 text-left hover:font-semibold hover:!text-heading ${
              isMobile
                ? "text-lg font-medium shadow-elevate-01 hover:bg-primary/10"
                : ""
            }`}
          >
            Artisan Dashboard
            <ExternalLink size={14} />
          </button>
        ) : (
          <button
            onClick={() => setOpenPromoteDialog(true)}
            className={`block w-full rounded-md p-4 text-left hover:bg-primary/10 hover:font-semibold hover:text-primary ${
              isMobile
                ? "text-lg font-medium shadow-elevate-01"
                : ""
            }`}
          >
            Become an Artisan
          </button>
        )}

        <button className="block rounded-md p-4 text-left text-destructive hover:!bg-destructive/5">
          Logout
        </button>
      </div>

      {/* Promote dialog */}
      <AlertDialog open={openPromoteDialog} onOpenChange={setOpenPromoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Become an Artisan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to become an artisan? This will allow you to
              offer your services to others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPromoting}>Cancel</AlertDialogCancel>
            <Button disabled={isPromoting} onClick={handlePromote}>
              {isPromoting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Promoting...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileTabs;
