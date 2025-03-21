
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "@/pages/Index";
import Quotes from "@/pages/Quotes";
import NewQuote from "@/pages/NewQuote";
import EditQuote from "@/pages/EditQuote";
import QuoteDetail from "@/pages/QuoteDetail";
import Invoices from "@/pages/Invoices";
import Customers from "@/pages/Customers";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="quotes/new" element={<NewQuote />} />
          <Route path="quotes/:id" element={<QuoteDetail />} />
          <Route path="quotes/:id/edit" element={<EditQuote />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="customers" element={<Customers />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
