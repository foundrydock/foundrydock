import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AudienceWindow from "./pages/AudienceWindow";
import NotFound from "./pages/NotFound";
import PasswordGate from "./components/PasswordGate";
import { LanguageProvider } from "./i18n/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PasswordGate>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/audience" element={<AudienceWindow />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PasswordGate>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
