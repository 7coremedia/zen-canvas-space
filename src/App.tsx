import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Services from "./pages/Services";
import Onboarding from "./pages/Onboarding";
import Contact from "./pages/Contact";
import CaseStudy from "./pages/CaseStudy";
import Auth from "./pages/Auth";
import BrandDetails from "./pages/BrandDetails";
import Dashboard from "./pages/Dashboard";
import BrandingChat from "./pages/BrandingChat";

import { AuthProvider } from "@/hooks/useAuth";
import CursorRing from "@/components/ui/CursorRing";

const queryClient = new QueryClient();

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isChatPage = location.pathname === "/branding-chat";
  return (
    <>
      <CursorRing enabled={false} size={56} />
      {!isChatPage && <Header />}
      <main className={isHome ? "" : isChatPage ? "" : "pt-28 md:pt-32"}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brand/:id" element={<BrandDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/branding-chat" element={<BrandingChat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
