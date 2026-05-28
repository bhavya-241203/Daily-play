import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Layout from './components/Layout';
import Onboarding from './components/screens/Onboarding';
import Dashboard from './components/screens/Dashboard';
import Career from './components/screens/Career';
import MatchSetup from './components/screens/MatchSetup';
import MatchRecord from './components/screens/MatchRecord';
import Achievements from './components/screens/Achievements';
import History from './components/screens/History';

function App() {
  const player = useGameStore(s => s.player);

  if (!player) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/career" element={<Career />} />
        <Route path="/play" element={<MatchSetup />} />
        <Route path="/record" element={<MatchRecord />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
