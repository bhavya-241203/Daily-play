import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Trophy, MapPin, Clock, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GameSession, Sport } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string; bg: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e', bg: 'bg-green-500/10' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b', bg: 'bg-amber-500/10' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4', bg: 'bg-cyan-500/10' },
  football: { icon: '⚽', label: 'Football', color: '#f97316', bg: 'bg-orange-500/10' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7', bg: 'bg-purple-500/10' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6', bg: 'bg-blue-500/10' },
};

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-green-500/20 text-green-400',
  full: 'bg-red-500/20 text-red-400',
  completed: 'bg-slate-500/20 text-slate-400',
  cancelled: 'bg-red-900/20 text-red-600',
};

function formatDate(dateStr: string, timeStr: string): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const d = new Date(dateStr);
  const todayStr = today.toISOString().split('T')[0];
  const tomStr = tomorrow.toISOString().split('T')[0];
  if (dateStr === todayStr) return `Today, ${formatTime(timeStr)}`;
  if (dateStr === tomStr) return `Tomorrow, ${formatTime(timeStr)}`;
  return `${d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}, ${formatTime(timeStr)}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function SessionCard({ session, onPress }: { session: GameSession; onPress: () => void }) {
  const player = useGameStore(s => s.player);
  const joinSession = useGameStore(s => s.joinSession);
  const cfg = SPORT_CONFIG[session.sport];
  const isFull = session.currentPlayers.length >= session.maxPlayers;
  const isJoined = player ? session.currentPlayers.includes(player.name) : false;

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFull && !isJoined) joinSession(session.id);
  };

  return (
    <div
      onClick={onPress}
      className="min-w-[260px] bg-bg-card border border-bg-border rounded-2xl overflow-hidden cursor-pointer card-hover"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <div className="text-white font-semibold text-sm leading-tight">{session.title}</div>
            <div className="text-slate-500 text-xs">{cfg.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
          <Clock size={12} />
          <span>{formatDate(session.date, session.time)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
          <MapPin size={12} />
          <span className="truncate">{session.venue}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{session.hostAvatar}</span>
            <div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={11} />
                <span className="font-semibold" style={{ color: cfg.color }}>
                  {session.currentPlayers.length}/{session.maxPlayers}
                </span>
              </div>
              <div className="text-xs text-slate-500 capitalize">{session.skillLevel}</div>
            </div>
          </div>
          <button
            onClick={handleJoin}
            disabled={isFull || isJoined || session.status !== 'open'}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all duration-150 active:scale-95 ${
              isJoined
                ? 'bg-green-500/20 text-green-400'
                : isFull || session.status !== 'open'
                ? 'bg-bg-border text-slate-500 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-indigo-500'
            }`}
          >
            {isJoined ? '✓ Joined' : isFull ? 'Full' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MySessions({ sessions }: { sessions: GameSession[] }) {
  const navigate = useNavigate();
  if (sessions.length === 0) {
    return (
      <div className="bg-bg-card border border-bg-border rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">🎯</div>
        <p className="text-slate-400 text-sm">No sessions yet</p>
        <p className="text-slate-500 text-xs mt-1">Create one or join a game nearby</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.slice(0, 3).map(session => {
        const cfg = SPORT_CONFIG[session.sport];
        return (
          <div
            key={session.id}
            onClick={() => navigate(`/session/${session.id}`)}
            className="bg-bg-card border border-bg-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer card-hover"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${cfg.color}20` }}
            >
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{session.title}</div>
              <div className="text-slate-400 text-xs">{formatDate(session.date, session.time)}</div>
            </div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[session.status]}`}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const player = useGameStore(s => s.player);
  const sessions = useGameStore(s => s.sessions);

  if (!player) return null;

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));

  const nearbySessions = sessions.filter(
    s => s.city === player.city && s.status === 'open' && s.date >= new Date().toISOString().split('T')[0]
  );

  const mySessions = sessions.filter(
    s =>
      (s.hostId === player.id || s.currentPlayers.includes(player.name)) &&
      s.status !== 'cancelled'
  );

  // Random-ish active player count based on city
  const cityPlayerCounts: Record<string, number> = {
    Bangalore: 62, Mumbai: 48, Pune: 31, Hyderabad: 27, Delhi: 39, Chennai: 22, Kolkata: 18,
  };
  const activeCount = cityPlayerCounts[player.city] ?? 20;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Greeting + Player Card */}
      <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/profile')}
            className="text-4xl cursor-pointer active:scale-95 transition-transform"
          >
            {player.avatar}
          </button>
          <div className="flex-1">
            <p className="text-slate-400 text-sm">{getGreeting()},</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-lg">{player.name}!</span>
              {player.streak > 0 && (
                <span className="flex items-center gap-0.5 text-amber-400 text-sm font-semibold">
                  🔥 {player.streak} day streak
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Lv.{player.level}
              </span>
              <span className="text-slate-400 text-xs">{player.title}</span>
            </div>
          </div>
          <button onClick={() => navigate('/tournaments')} className="p-2 rounded-xl bg-bg-primary border border-bg-border text-slate-400 hover:text-yellow-400 transition-colors">
            <Trophy size={18} />
          </button>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span className="text-xp font-semibold">{player.xp} XP</span>
            <span>{player.xpToNextLevel - player.xp} to Lv.{player.level + 1}</span>
          </div>
          <div className="h-2.5 bg-bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full progress-bar"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Play Today CTA */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/30 border border-accent/30 rounded-2xl p-5">
        <div className="text-2xl mb-1">🎯</div>
        <h2 className="text-white font-black text-xl mb-1">Play Today</h2>
        <p className="text-slate-400 text-sm mb-4">Organise a game or find one near you</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/create')}
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all duration-200 active:scale-95 glow-accent"
          >
            <Plus size={18} />
            Create Session
          </button>
          <button
            onClick={() => navigate('/find')}
            className="flex items-center gap-1 text-accent text-sm font-semibold py-3 px-3 rounded-xl border border-accent/30 hover:bg-accent/10 transition-all"
          >
            Browse <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Sessions Near You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-base">Sessions near you</h3>
          <button onClick={() => navigate('/find')} className="text-accent text-sm font-medium flex items-center gap-0.5">
            See all <ChevronRight size={14} />
          </button>
        </div>
        {nearbySessions.length === 0 ? (
          <div className="bg-bg-card border border-bg-border rounded-2xl p-5 text-center">
            <p className="text-slate-400 text-sm">No open sessions in {player.city}</p>
            <p className="text-slate-500 text-xs mt-1">Be the first — create one!</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {nearbySessions.map(s => (
              <SessionCard
                key={s.id}
                session={s}
                onPress={() => navigate(`/session/${s.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Sessions */}
      <div>
        <h3 className="text-white font-bold text-base mb-3">Your sessions</h3>
        <MySessions sessions={mySessions} />
        {mySessions.length > 3 && (
          <button onClick={() => navigate('/find')} className="mt-2 text-accent text-sm font-medium flex items-center gap-0.5">
            View all sessions <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Community Pulse */}
      <div className="bg-bg-card border border-bg-border rounded-2xl p-4 flex items-center gap-3">
        <div className="text-3xl">🌆</div>
        <div>
          <p className="text-white font-semibold text-sm">
            <span className="text-accent">{activeCount} players</span> active in {player.city} today
          </p>
          <p className="text-slate-500 text-xs">Join the community — get out and play!</p>
        </div>
      </div>

      {/* Bottom padding for nav */}
      <div className="h-4" />
    </div>
  );
}
