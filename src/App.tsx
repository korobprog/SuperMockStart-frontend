import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import Interview from '@/pages/Interview';
import About from '@/pages/About';
import ChooseInterview from './pages/Chooseinterview';
import CollectingContacts from './pages/Collectingcontacts';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/about" element={<About />} />
          <Route path="/choose-interview" element={<ChooseInterview />} />
          <Route path="/collecting-contacts" element={<CollectingContacts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
