import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useGameStore, COMMUNITY_MEMBERS } from '../../store/gameStore';

const CITIES = ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Delhi'];

const CITY_STATS: Record<string, { activePlayers: number; sessionsToday: number; partnerTurfs: number }> = {
  Bangalore: { activePlayers: 62, sessionsToday: 8, partnerTurfs: 3 },
  Mumbai: { activePlayers: 48, sessionsToday: 5, partnerTurfs: 2 },
  Pune: { activePlayers: 31, sessionsToday: 4, partnerTurfs: 2 },
  Hyderabad: { activePlayers: 27, sessionsToday: 3, partnerTurfs: 1 },
  Delhi: { activePlayers: 39, sessionsToday: 6, partnerTurfs: 1 },
};

function getMedalColor(rank: number): string {
  if (rank === 1) return '#fbbf24'; // gold
  if (rank === 2) return '#94a3b8'; // silver
  if (rank === 3) return '#d97706'; // bronze
  return '';
}

export default function Community() {
  const navigate = useNavigate();
  const player = useGameStore(s => s.player);
  const sessions = useGameStore(s => s.sessions);

  const [selectedCity, setSelectedCity] = useState(player?.city ?? 'Bangalore');

  if (!player) return null;

  // Build leaderboard: community members + current player
  const communityForCity = COMMUNITY_MEMBERS.filter(m => m.city === selectedCity);
  const playerEntry = {
    id: player.id,
    name: player.name,
    avatar: player.avatar,
    city: player.city,
    totalSessions: player.totalSessions,
    streak: player.streak,
    level: player.level,
    isMe: true,
  };

  // Merge and sort by totalSessions
  const allEntries = [
    ...communityForCity.map(m => ({ ...m, isMe: false })),
    ...(selectedCity === player.city ? [playerEntry] : []),
  ].sort((a, b) => b.totalSessions - a.totalSessions);

  // Top sessions this week (most players)
  const today = new Date().toISOString().split('T')[0];
  const topSessions = [...sessions]
    .filter(s => s.status !== 'cancelled' && s.date >= today)
    .sort((a, b) => b.currentPlayers.length - a.currentPlayers.length)
    .slice(0, 3);

  const cityStats = CITY_STATS[selectedCity] ?? { activePlayers: 20, sessionsToday: 2, partnerTurfs: 1 };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-4 pt-6 pb-2 flex-shrink-0">
        <h1 className="text-white font-black text-2xl mb-4">Community</h1>

        {/* City tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-accent text-white'
                  : 'bg-bg-card border border-bg-border text-slate-400'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Community stats strip */}
        <div className="grid grid-cols-3 gap-2 py-3">
          <div className="bg-bg-card border border-bg-border rounded-xl p-3 text-center">
            <div className="text-accent font-black text-lg">{cityStats.activePlayers}</div>
            <div className="text-slate-500 text-xs">Active players</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-xl p-3 text-center">
            <div className="text-green-400 font-black text-lg">{cityStats.sessionsToday}</div>
            <div className="text-slate-500 text-xs">Sessions today</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-xl p-3 text-center">
            <div className="text-amber-400 font-black text-lg">{cityStats.partnerTurfs}</div>
            <div className="text-slate-500 text-xs">Partner turfs</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-yellow-400" />
            <h2 className="text-white font-bold">Most Active Players</h2>
            <span className="text-slate-500 text-xs">· {selectedCity}</span>
          </div>

          {allEntries.length === 0 ? (
            <div className="bg-bg-card border border-bg-border rounded-2xl p-6 text-center">
              <p className="text-slate-400 text-sm">No players yet in {selectedCity}</p>
            </div>
          ) : (
            <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
              {allEntries.slice(0, 10).map((entry, i) => {
                const rank = i + 1;
                const medalColor = getMedalColor(rank);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-bg-border last:border-b-0 ${
                      entry.isMe ? 'bg-accent/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-7 text-center flex-shrink-0">
                      {rank <= 3 ? (
                        <span style={{ color: medalColor }} className="text-lg">
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm font-mono">{rank}</span>
                      )}
                    </div>

                    {/* Avatar + Name */}
                    <span className="text-2xl flex-shrink-0">{entry.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold truncate ${entry.isMe ? 'text-accent' : 'text-white'}`}>
                          {entry.name}
                        </span>
                        {entry.isMe && (
                          <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-full flex-shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Lv.{entry.level} · 🔥 {entry.streak} streak
                      </div>
                    </div>

                    {/* Sessions count */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-bold text-sm">{entry.totalSessions}</div>
                      <div className="text-slate-500 text-xs">sessions</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Sessions This Week */}
        <div className="mb-6">
          <h2 className="text-white font-bold mb-3">🔥 Top Sessions This Week</h2>
          {topSessions.length === 0 ? (
            <div className="bg-bg-card border border-bg-border rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-sm">No sessions yet this week</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topSessions.map(session => {
                const SPORT_COLORS: Record<string, string> = {
                  cricket: '#22c55e', badminton: '#f59e0b', pickleball: '#06b6d4',
                  football: '#f97316', gym: '#a855f7', ps5: '#3b82f6',
                };
                const SPORT_ICONS: Record<string, string> = {
                  cricket: '🏏', badminton: '🏸', pickleball: '🥒',
                  football: '⚽', gym: '💪', ps5: '🎮',
                };
                const color = SPORT_COLORS[session.sport] ?? '#6366f1';

                return (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/session/${session.id}`)}
                    className="bg-bg-card border border-bg-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer card-hover"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {SPORT_ICONS[session.sport]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{session.title}</div>
                      <div className="text-slate-400 text-xs">{session.city} · by {session.hostName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm" style={{ color }}>
                        {session.currentPlayers.length}
                      </div>
                      <div className="text-slate-500 text-xs">players</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA to tournaments */}
        <div
          onClick={() => navigate('/tournaments')}
          className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border border-amber-500/30 rounded-2xl p-5 cursor-pointer card-hover"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-white font-bold">Upcoming Tournaments</div>
              <div className="text-slate-400 text-sm">Register your team and compete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
