
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
import Messages from "@/pages/Messages";
import Calendar from "@/pages/Calendar";
import Leads from "@/pages/Leads";
import NotFound from "@/pages/NotFound";
import { CustomersProvider } from "./context/CustomersContext";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <CustomersProvider>
            <Routes>
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/quotes" element={<AppLayout><Quotes /></AppLayout>} />
              <Route path="/quotes/new" element={<AppLayout><NewQuote /></AppLayout>} />
              <Route path="/quotes/:id" element={<AppLayout><QuoteDetail /></AppLayout>} />
              <Route path="/work-orders/:id" element={<WorkOrder />} />
              <Route path="/invoices" element={<AppLayout><Invoices /></AppLayout>} />
              <Route path="/customers" element={<AppLayout><Customers /></AppLayout>} />
              <Route path="/leads" element={<AppLayout><Leads /></AppLayout>} />
              <Route path="/tasks" element={<AppLayout><Tasks /></AppLayout>} />
              <Route path="/messages" element={<AppLayout><Messages /></AppLayout>} />
              <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
              <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
            </Routes>
          </CustomersProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
