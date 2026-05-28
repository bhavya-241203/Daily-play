import { Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import Layout from './components/Layout';
import Onboarding from './components/screens/Onboarding';
import Dashboard from './components/screens/Dashboard';
import FindGame from './components/screens/FindGame';
import CreateSession from './components/screens/CreateSession';
import SessionDetail from './components/screens/SessionDetail';
import Venues from './components/screens/Venues';
import Community from './components/screens/Community';
import Profile from './components/screens/Profile';
import Tournaments from './components/screens/Tournaments';

function App() {
  const player = useGameStore(s => s.player);

  if (!player) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/find" element={<FindGame />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
