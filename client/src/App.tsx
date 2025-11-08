import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, ProtectedRoute, ToasterConfig } from '@/components';
import { LandingPremium, Auth, Dashboard, Profile, Settings, Messages, Bookings, Booking, Favorites, BrowseVanilla, CelebrityProfile, MeetingTypeSelection, ApplicationProfessional, ApplicationPersonal, ApplicationConfirmation, AboutVanilla, FAQVanilla, ContactVanilla, HowItWorks, ForCelebritiesVanilla, TeamVanilla, JobsVanilla, TermsVanilla, PrivacyVanilla } from '@/pages';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/" element={<LandingPremium />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<BrowseVanilla />} />
            <Route path="/celebrity/:slug" element={<CelebrityProfile />} />

            {/* Application Flow Routes */}
            <Route path="/apply/:slug" element={<MeetingTypeSelection />} />
            <Route path="/apply/:slug/professional" element={<ApplicationProfessional />} />
            <Route path="/apply/:slug/personal" element={<ApplicationPersonal />} />
            <Route path="/apply/:slug/confirmation" element={<ApplicationConfirmation />} />

            <Route path="/about" element={<AboutVanilla />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/for-celebrities" element={<ForCelebritiesVanilla />} />
            <Route path="/team" element={<TeamVanilla />} />
            <Route path="/jobs" element={<JobsVanilla />} />
            <Route path="/faq" element={<FAQVanilla />} />
            <Route path="/contact" element={<ContactVanilla />} />
            <Route path="/terms" element={<TermsVanilla />} />
            <Route path="/privacy" element={<PrivacyVanilla />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <ToasterConfig />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
