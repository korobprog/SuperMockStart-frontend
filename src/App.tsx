import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Interview from '@/pages/Interview';
import About from '@/pages/About';
import ChooseInterview from './pages/Chooseinterview';
import CollectingContacts from './pages/Collectingcontacts';
import Auth from './pages/Auth';
import DebugAuth from './components/DebugAuth';
import AuthDemo from './pages/AuthDemo';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/about" element={<About />} />
          <Route path="/chooseinterview" element={<ChooseInterview />} />
          <Route path="/collectingcontacts" element={<CollectingContacts />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/debug-auth" element={<DebugAuth />} />
          <Route path="/auth-demo" element={<AuthDemo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
