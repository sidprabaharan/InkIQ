
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Quotes from "./pages/Quotes";
import NewQuote from "./pages/NewQuote";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/quotes" element={<AppLayout><Quotes /></AppLayout>} />
          <Route path="/quotes/new" element={<AppLayout><NewQuote /></AppLayout>} />
          {/* Routes for all the sidebar items */}
          <Route path="/dashboard" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/calendar" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/contacts" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/leads" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/invoices" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/customers" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/products" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/purchase-orders" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/messages" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/payments" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/expenses" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/analytics" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/merch-stores" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/logout" element={<AppLayout><Index /></AppLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
