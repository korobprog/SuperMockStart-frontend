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
import Feedback from './pages/Feedback';
import FeedbackHistory from './pages/FeedbackHistory';
import TestFeedback from './pages/TestFeedback';
import TestCompleteSession from './pages/TestCompleteSession';
import ModernBordersDemo from './pages/ModernBordersDemo';
import TailwindTest from './pages/TailwindTest';
import CSSVariablesTest from './pages/CSSVariablesTest';
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

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
            <Route path="/modern-borders-demo" element={<ModernBordersDemo />} />
            <Route path="/tailwind-test" element={<TailwindTest />} />
            <Route path="/css-variables-test" element={<CSSVariablesTest />} />

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
              path="/choose-interview"
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
            <Route path="/test-complete-session" element={<TestCompleteSession />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
