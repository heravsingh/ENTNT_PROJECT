
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";
import { RentalsProvider } from "./contexts/RentalsContext";
import { MaintenanceProvider } from "./contexts/MaintenanceContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentPage from "./pages/EquipmentPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import RentalsPage from "./pages/RentalsPage";
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/CalendarPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EquipmentProvider>
          <RentalsProvider>
            <MaintenanceProvider>
              <NotificationProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/" element={<AppLayout />}>
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="equipment" element={<EquipmentPage />} />
                      <Route path="equipment/:id" element={<EquipmentDetailPage />} />
                      <Route path="rentals" element={<RentalsPage />} />
                      <Route path="maintenance" element={<MaintenancePage />} />
                      <Route path="calendar" element={<CalendarPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NotificationProvider>
            </MaintenanceProvider>
          </RentalsProvider>
        </EquipmentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
