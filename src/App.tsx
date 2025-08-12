
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/AppLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

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
import ArtworkFiles from "@/pages/ArtworkFiles";

import NotFound from "@/pages/NotFound";
import { CustomersProvider } from "./context/CustomersContext";
import { CartManagerProvider } from "./context/CartManagerContext";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <CustomersProvider>
            <CartManagerProvider>
              <Routes>
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/quotes" element={<AppLayout><Quotes /></AppLayout>} />
                <Route path="/quotes/new" element={<AppLayout><NewQuote /></AppLayout>} />
                <Route path="/quotes/:id/edit" element={<AppLayout><NewQuote /></AppLayout>} />
                <Route path="/quotes/:id" element={<AppLayout><QuoteDetail /></AppLayout>} />
                <Route path="/work-orders/:id" element={<WorkOrder />} />
                <Route path="/invoices" element={<AppLayout><Invoices /></AppLayout>} />
                <Route path="/customers" element={<AppLayout><Customers /></AppLayout>} />
                
                <Route path="/leads" element={<AppLayout><Leads /></AppLayout>} />
                <Route path="/tasks" element={<AppLayout><Tasks /></AppLayout>} />
                <Route path="/messages" element={<AppLayout><Emails /></AppLayout>} />
                <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
                <Route path="/products" element={<AppLayout><Products /></AppLayout>} />
                <Route path="/purchase-orders" element={<AppLayout><PurchaseOrders /></AppLayout>} />
                <Route path="/production" element={<AppLayout><Production /></AppLayout>} />
                <Route path="/artwork-files" element={<AppLayout><ArtworkFiles /></AppLayout>} />
                
                <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
                <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
              </Routes>
            </CartManagerProvider>
          </CustomersProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
