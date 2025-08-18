import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./components/UserDashboard/Dashboard/Dashboard";
import ProfilePage from "./components/UserDashboard/UserProfile/Profile";
import UserNotifications from "./components/UserDashboard/Dashboard/Notifications/notifications";
import NotFound from "./pages/NotFound";

import BusTrackerPage from "./components/UserDashboard/Dashboard/BusTracker/BusTrackerPage";
import TripPlannerPage from "./components/UserDashboard/Dashboard/TripPlanner/TripPlannerPage"; // Add this
import FriendsPage from "./components/UserDashboard/UserProfile/Friends";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bus-tracker" element={<BusTrackerPage />} />
          <Route path="/plan-trip" element={<TripPlannerPage />} />{" "}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<UserNotifications />} />
          <Route path="/friends" element={<FriendsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
