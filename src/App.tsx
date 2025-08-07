import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navigation from './components/Navigation';
import ModernHeader from './components/ModernHeader';
import Home from './pages/Home';
import Interview from './pages/Interview';
import About from './pages/About';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ChooseInterview from './pages/Chooseinterview';
import CollectingContacts from './pages/Collectingcontacts';
import Auth from './pages/Auth';
import DebugAuth from './components/DebugAuth';
import AuthDemo from './pages/AuthDemo';
import TelegramAuthCallback from './pages/TelegramAuthCallback';
import TokenCheck from './pages/TokenCheck';
import Feedback from './pages/Feedback';
import FeedbackHistory from './pages/FeedbackHistory';
import TestFeedback from './pages/TestFeedback';
import TestCompleteSession from './pages/TestCompleteSession';
import TelegramAuthFix from './pages/TelegramAuthFix';
import ModernBordersDemo from './pages/ModernBordersDemo';
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Component to conditionally render header
const ConditionalHeader = () => {
  const location = useLocation();

  // Use modern header on main pages, old navigation on specific functional pages
  const useModernHeader = [
    '/',
    '/about',
    '/interview',
    '/feedback-history',
    '/profile',
    '/dashboard',
    '/test-complete-session',
    '/auth',
    '/collectingcontacts',
    '/modern-borders-demo',
  ].includes(location.pathname);

  return useModernHeader ? <ModernHeader /> : <Navigation />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <ConditionalHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/modern-borders-demo"
              element={<ModernBordersDemo />}
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chooseinterview"
              element={
                <ProtectedRoute>
                  <ChooseInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collectingcontacts"
              element={
                <ProtectedRoute>
                  <CollectingContacts />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/debug-auth" element={<DebugAuth />} />
            <Route path="/auth-demo" element={<AuthDemo />} />
            <Route path="/auth-callback" element={<TelegramAuthCallback />} />
            <Route path="/token-check" element={<TokenCheck />} />
            <Route path="/auth-fix" element={<TelegramAuthFix />} />
            <Route
              path="/feedback/:sessionId"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback-history"
              element={
                <ProtectedRoute>
                  <FeedbackHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/test-feedback" element={<TestFeedback />} />
            <Route
              path="/test-complete-session"
              element={<TestCompleteSession />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
