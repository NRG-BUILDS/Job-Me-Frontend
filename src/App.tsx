import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import VerifyOTP from "./pages/auth/verify-otp";
import Index from "./pages/Index";
import ServicePage from "./pages/service";
import MainLayout from "./components/layout/main-layout";
import ProfilePage from "./pages/profile";

import SetAppointment from "./pages/service/send-message";
import ProfileLayout from "./pages/profile/layout";
import ArtisanDashboard from "./pages/artisan/dashboard";
import ArtisanBookings from "./pages/artisan/bookings";
import SkillsDashboard from "./pages/artisan/services/services-dashboard";
import CreateSkillsForm from "./pages/artisan/services/create";
import CategoriesPage from "./pages/categories/categories";
import LeaveReviewPage from "./pages/profile/leave-review";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner richColors />
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/ref" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/categories" element={<CategoriesPage />} />

          <Route path="/profile/*" element={<ProfileLayout />} />

          <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
          <Route path="/artisan/bookings" element={<ArtisanBookings />} />
          <Route path="/artisan/skills" element={<SkillsDashboard />} />
          <Route path="/artisan/skills/new" element={<CreateSkillsForm />} />
          <Route
            path="/artisan/skills/edit/:id"
            element={<CreateSkillsForm />}
          />
          <Route path="/leave-review" element={<LeaveReviewPage />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;
