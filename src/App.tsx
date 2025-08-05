import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ModernHeader from '@/components/ModernHeader';
import Home from '@/pages/Home';
import Interview from '@/pages/Interview';
import About from '@/pages/About';
import Profile from '@/pages/Profile';
import Dashboard from '@/pages/Dashboard';
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
import AuthProvider from './components/AuthProvider';

// Component to conditionally render header
const ConditionalHeader = () => {
  const location = useLocation();

  // Use modern header only on main pages, old navigation on specific functional pages
  const useModernHeader = [
    '/',
    '/about',
    '/interview',
    '/feedback-history',
    '/profile',
    '/dashboard',
    '/test-complete-session',
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
            <Route path="/interview" element={<Interview />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chooseinterview" element={<ChooseInterview />} />
            <Route
              path="/collectingcontacts"
              element={<CollectingContacts />}
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/debug-auth" element={<DebugAuth />} />
            <Route path="/auth-demo" element={<AuthDemo />} />
            <Route path="/auth-callback" element={<TelegramAuthCallback />} />
            <Route path="/token-check" element={<TokenCheck />} />
            <Route path="/auth-fix" element={<TelegramAuthFix />} />
            <Route path="/feedback/:sessionId" element={<Feedback />} />
            <Route path="/feedback-history" element={<FeedbackHistory />} />
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
