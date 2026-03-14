import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { CompanyProvider } from "./auth/CompanyContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import LibraryFolder from "./pages/LibraryFolder";
import Pitchdecks from "./pages/Pitchdecks";
import PitchdeckEditor from "./pages/Index";
import ShareLinks from "./pages/ShareLinks";
import Admin from "./pages/Admin";
import Companies from "./pages/Companies";
import Documents from "./pages/Documents";
import DocumentEditor from "./pages/DocumentEditor";
import BoardMeetings from "./pages/BoardMeetings";
import BoardMeetingDetail from "./pages/BoardMeetingDetail";
import BrandGuide from "./pages/BrandGuide";
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

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <CompanyProvider>
        <AppLayout>{children}</AppLayout>
      </CompanyProvider>
    </RequireAuth>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Julkiset */}
      <Route path="/login" element={<Login />} />
      <Route path="/share/:token" element={<ShareView />} />
      <Route path="/audience" element={<AudienceWindow />} />

      {/* Suojatut */}
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/library" element={<ProtectedLayout><Library /></ProtectedLayout>} />
      <Route path="/library/:folderId" element={<ProtectedLayout><LibraryFolder /></ProtectedLayout>} />
      <Route path="/pitchdecks" element={<ProtectedLayout><Pitchdecks /></ProtectedLayout>} />
      <Route path="/documents" element={<ProtectedLayout><Documents /></ProtectedLayout>} />
      <Route path="/documents/:docId" element={<ProtectedLayout><DocumentEditor /></ProtectedLayout>} />
      <Route path="/board" element={<ProtectedLayout><BoardMeetings /></ProtectedLayout>} />
      <Route path="/board/:meetingId" element={<ProtectedLayout><BoardMeetingDetail /></ProtectedLayout>} />
      <Route path="/brand" element={<ProtectedLayout><BrandGuide /></ProtectedLayout>} />
      <Route path="/share-links" element={<ProtectedLayout><ShareLinks /></ProtectedLayout>} />
      <Route path="/admin" element={
        <RequireAuth><RequireAdmin><CompanyProvider><AppLayout><Admin /></AppLayout></CompanyProvider></RequireAdmin></RequireAuth>
      } />
      <Route path="/companies" element={
        <RequireAuth><RequireAdmin><CompanyProvider><AppLayout><Companies /></AppLayout></CompanyProvider></RequireAdmin></RequireAuth>
      } />

      {/* Pitchdeck-editori (oma layout) */}
      <Route path="/pitchdecks/:deckId/edit" element={
        <RequireAuth>
          <LanguageProvider>
            <PitchdeckEditor />
          </LanguageProvider>
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
