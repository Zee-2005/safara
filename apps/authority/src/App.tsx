import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tourists from "./pages/Tourists";
import Incidents from "./pages/Incidents";
import Zones from "./pages/Zones";
import Analytics from "./pages/Analytics";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";

// Simple auth check component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = localStorage.getItem('sentinelview_auth');
  return auth ? <>{children}</> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />

          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tourists" element={<Tourists />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="zones" element={<Zones />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
