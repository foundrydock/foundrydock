import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider, useAuth } from "./auth/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import LibraryFolder from "./pages/LibraryFolder";
import Pitchdecks from "./pages/Pitchdecks";
import PitchdeckEditor from "./pages/Index";
import ShareLinks from "./pages/ShareLinks";
import Admin from "./pages/Admin";
import ShareView from "./pages/ShareView";
import AudienceWindow from "./pages/AudienceWindow";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
    </div>
  );
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Julkiset reitit */}
      <Route path="/login" element={<Login />} />
      <Route path="/share/:token" element={<ShareView />} />
      <Route path="/audience" element={<AudienceWindow />} />

      {/* Suojatut reitit */}
      <Route path="/" element={
        <RequireAuth>
          <AppLayout><Dashboard /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/library" element={
        <RequireAuth>
          <AppLayout><Library /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/library/:folderId" element={
        <RequireAuth>
          <AppLayout><LibraryFolder /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/pitchdecks" element={
        <RequireAuth>
          <AppLayout><Pitchdecks /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/pitchdecks/:deckId/edit" element={
        <RequireAuth>
          <LanguageProvider>
            <PitchdeckEditor />
          </LanguageProvider>
        </RequireAuth>
      } />
      <Route path="/share-links" element={
        <RequireAuth>
          <AppLayout><ShareLinks /></AppLayout>
        </RequireAuth>
      } />
      <Route path="/admin" element={
        <RequireAuth>
          <RequireAdmin>
            <AppLayout><Admin /></AppLayout>
          </RequireAdmin>
        </RequireAuth>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
