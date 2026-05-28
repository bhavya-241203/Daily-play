import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GameSession, Sport, SkillLevel } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4' },
  football: { icon: '⚽', label: 'Football', color: '#f97316' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6' },
};

type DateFilter = 'all' | 'today' | 'tomorrow' | 'weekend';

function getDateRange(filter: DateFilter): { start: string; end: string } | null {
  const today = new Date().toISOString().split('T')[0];
  if (filter === 'all') return null;
  if (filter === 'today') return { start: today, end: today };
  if (filter === 'tomorrow') {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const d = t.toISOString().split('T')[0];
    return { start: d, end: d };
  }
  if (filter === 'weekend') {
    const now = new Date();
    const day = now.getDay();
    const toSat = (6 - day + 7) % 7;
    const sat = new Date(now);
    sat.setDate(now.getDate() + toSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return {
      start: sat.toISOString().split('T')[0],
      end: sun.toISOString().split('T')[0],
    };
  }
  return null;
}

function formatDate(dateStr: string, timeStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomStr = tomorrow.toISOString().split('T')[0];
  const d = new Date(dateStr);
  if (dateStr === today) return `Today, ${formatTime(timeStr)}`;
  if (dateStr === tomStr) return `Tomorrow, ${formatTime(timeStr)}`;
  return `${d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}, ${formatTime(timeStr)}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function JoinSheet({
  session,
  onClose,
  onConfirm,
}: {
  session: GameSession;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const cfg = SPORT_CONFIG[session.sport];
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="w-12 h-1 bg-bg-border rounded-full mx-auto mb-5" />
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${cfg.color}20` }}
          >
            {cfg.icon}
          </div>
          <div>
            <div className="text-white font-bold">{session.title}</div>
            <div className="text-slate-400 text-sm">{cfg.label} · {session.skillLevel}</div>
          </div>
        </div>
        <div className="space-y-2 mb-6 bg-bg-primary rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock size={14} className="text-slate-500" />
            <span>{formatDate(session.date, session.time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin size={14} className="text-slate-500" />
            <span>{session.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users size={14} className="text-slate-500" />
            <span>{session.currentPlayers.length} / {session.maxPlayers} players joined</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="text-slate-500">Host:</span>
            <span>{session.hostAvatar} {session.hostName}</span>
          </div>
        </div>
        {session.notes && (
          <p className="text-slate-400 text-sm bg-bg-primary rounded-xl p-3 mb-6">{session.notes}</p>
        )}
        <button
          onClick={onConfirm}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all duration-200 active:scale-95"
        >
          Confirm Join 🤝
        </button>
      </div>
    </div>
  );
}

export default function FindGame() {
  const navigate = useNavigate();
  const player = useGameStore(s => s.player);
  const sessions = useGameStore(s => s.sessions);
  const joinSession = useGameStore(s => s.joinSession);

  const [sportFilter, setSportFilter] = useState<Sport | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [skillFilter, setSkillFilter] = useState<SkillLevel | 'any'>('any');
  const [joinTarget, setJoinTarget] = useState<GameSession | null>(null);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];

  const filtered = sessions.filter(s => {
    if (s.status === 'cancelled') return false;
    if (s.date < today) return false;
    if (sportFilter !== 'all' && s.sport !== sportFilter) return false;
    if (skillFilter !== 'any' && s.skillLevel !== skillFilter && s.skillLevel !== 'open') return false;
    const range = getDateRange(dateFilter);
    if (range && (s.date < range.start || s.date > range.end)) return false;
    return true;
  });

  const handleConfirmJoin = () => {
    if (!joinTarget || !player) return;
    joinSession(joinTarget.id);
    setJoinedIds(prev => [...prev, joinTarget.id]);
    setJoinTarget(null);
    navigate(`/session/${joinTarget.id}`);
  };

  const sportFilters: { value: Sport | 'all'; label: string; icon?: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'badminton', label: 'Badminton', icon: '🏸' },
    { value: 'pickleball', label: 'Pickleball', icon: '🥒' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'gym', label: 'Gym', icon: '💪' },
    { value: 'ps5', label: 'PS5', icon: '🎮' },
  ];

  const dateFilters: { value: DateFilter; label: string }[] = [
    { value: 'all', label: 'All dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'weekend', label: 'Weekend' },
  ];

  const skillFilters: { value: SkillLevel | 'any'; label: string }[] = [
    { value: 'any', label: 'Any level' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-white font-black text-2xl mb-4">Find a Game</h1>

        {/* Sport filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
          {sportFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setSportFilter(f.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                sportFilter === f.value
                  ? 'bg-accent text-white'
                  : 'bg-bg-card border border-bg-border text-slate-400 hover:border-accent/50'
              }`}
            >
              {f.icon && <span>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* Date + Skill filters */}
        <div className="flex gap-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            {dateFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setDateFilter(f.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  dateFilter === f.value
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                    : 'bg-bg-card border border-bg-border text-slate-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
          {skillFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setSkillFilter(f.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                skillFilter === f.value
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-bg-card border border-bg-border text-slate-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white font-semibold mb-2">No open sessions found</p>
            <p className="text-slate-500 text-sm mb-6">
              {player ? `No sessions in ${player.city} matching your filters.` : ''}
              <br />Be the first — create one!
            </p>
            <button
              onClick={() => navigate('/create')}
              className="bg-accent text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-500 transition-colors"
            >
              Create a Session
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            {filtered.map(session => {
              const cfg = SPORT_CONFIG[session.sport];
              const isFull = session.currentPlayers.length >= session.maxPlayers;
              const isJoined =
                (player && session.currentPlayers.includes(player.name)) ||
                joinedIds.includes(session.id);

              return (
                <div
                  key={session.id}
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden cursor-pointer card-hover"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: cfg.color }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: `${cfg.color}20` }}
                        >
                          {cfg.icon}
                        </div>
                        <div>
                          <div className="text-white font-semibold leading-tight">{session.title}</div>
                          <div className="text-slate-500 text-xs">{cfg.label} · by {session.hostName}</div>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ml-2"
                        style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                      >
                        {session.skillLevel}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>{formatDate(session.date, session.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin size={12} />
                        <span className="truncate">{session.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Users size={12} />
                        <div className="flex items-center gap-1">
                          <span className="font-semibold" style={{ color: cfg.color }}>
                            {session.currentPlayers.length}/{session.maxPlayers}
                          </span>
                          <span>players</span>
                          <div className="flex ml-1">
                            {session.currentPlayers.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full flex items-center justify-center text-xs -ml-1 border border-bg-card"
                                style={{ backgroundColor: `${cfg.color}40` }}
                              >
                                👤
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {session.notes && (
                      <p className="text-slate-500 text-xs mb-3 line-clamp-1">{session.notes}</p>
                    )}

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (!isFull && !isJoined && session.status === 'open') {
                          setJoinTarget(session);
                        }
                      }}
                      disabled={isFull || !!isJoined || session.status !== 'open'}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
                        isJoined
                          ? 'bg-green-500/20 text-green-400'
                          : isFull || session.status !== 'open'
                          ? 'bg-bg-border text-slate-500 cursor-not-allowed'
                          : 'bg-accent text-white hover:bg-indigo-500'
                      }`}
                    >
                      {isJoined ? '✓ You\'re In' : isFull ? 'Session Full' : 'Join Session'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join confirmation sheet */}
      {joinTarget && (
        <JoinSheet
          session={joinTarget}
          onClose={() => setJoinTarget(null)}
          onConfirm={handleConfirmJoin}
        />
      )}
    </div>
  );
}
