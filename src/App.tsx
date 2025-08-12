
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/AppLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

import Index from "@/pages/Index";
import Quotes from "@/pages/Quotes";
import NewQuote from "@/pages/NewQuote";
import QuoteDetail from "@/pages/QuoteDetail";
import WorkOrder from "@/pages/WorkOrder";
import Invoices from "@/pages/Invoices";
import Customers from "@/pages/Customers";

import Tasks from "@/pages/Tasks";
import Emails from "@/pages/Emails";
import Calendar from "@/pages/Calendar";
import Leads from "@/pages/Leads";
import Settings from "@/pages/Settings";
import Products from "@/pages/Products";
import PurchaseOrders from "@/pages/PurchaseOrders";
import Production from "@/pages/Production";

import NotFound from "@/pages/NotFound";
import { CustomersProvider } from "./context/CustomersContext";
import { CartManagerProvider } from "./context/CartManagerContext";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import Signup from "@/pages/Signup";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <CustomersProvider>
              <CartManagerProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/logout" element={<Logout />} />

                  <Route path="/" element={<ProtectedRoute><AppLayout><Index /></AppLayout></ProtectedRoute>} />
                  <Route path="/quotes" element={<ProtectedRoute><AppLayout><Quotes /></AppLayout></ProtectedRoute>} />
                  <Route path="/quotes/new" element={<ProtectedRoute><AppLayout><NewQuote /></AppLayout></ProtectedRoute>} />
                  <Route path="/quotes/:id/edit" element={<ProtectedRoute><AppLayout><NewQuote /></AppLayout></ProtectedRoute>} />
                  <Route path="/quotes/:id" element={<ProtectedRoute><AppLayout><QuoteDetail /></AppLayout></ProtectedRoute>} />
                  <Route path="/work-orders/:id" element={<ProtectedRoute><WorkOrder /></ProtectedRoute>} />
                  <Route path="/invoices" element={<ProtectedRoute><AppLayout><Invoices /></AppLayout></ProtectedRoute>} />
                  <Route path="/customers" element={<ProtectedRoute><AppLayout><Customers /></AppLayout></ProtectedRoute>} />
                  <Route path="/leads" element={<ProtectedRoute><AppLayout><Leads /></AppLayout></ProtectedRoute>} />
                  <Route path="/tasks" element={<ProtectedRoute><AppLayout><Tasks /></AppLayout></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><AppLayout><Emails /></AppLayout></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><AppLayout><Calendar /></AppLayout></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute><AppLayout><Products /></AppLayout></ProtectedRoute>} />
                  <Route path="/purchase-orders" element={<ProtectedRoute><AppLayout><PurchaseOrders /></AppLayout></ProtectedRoute>} />
                  <Route path="/production" element={<ProtectedRoute><AppLayout><Production /></AppLayout></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
                  <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
                </Routes>
              </CartManagerProvider>
            </CustomersProvider>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
