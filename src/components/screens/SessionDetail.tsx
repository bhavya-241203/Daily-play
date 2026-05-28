import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Users, QrCode, CheckCircle, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Sport } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4' },
  football: { icon: '⚽', label: 'Football', color: '#f97316' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6' },
};

function formatDate(dateStr: string, timeStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomStr = tomorrow.toISOString().split('T')[0];
  const d = new Date(dateStr);
  if (dateStr === today) return `Today, ${formatTime(timeStr)}`;
  if (dateStr === tomStr) return `Tomorrow, ${formatTime(timeStr)}`;
  return `${d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}, ${formatTime(timeStr)}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

type CheckinState = 'idle' | 'scanning' | 'done';

function CheckinModal({
  onClose,
  result,
}: {
  onClose: () => void;
  result: { xpEarned: number; breakdown: { label: string; amount: number }[]; leveledUp: boolean; newLevel?: number } | null;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl p-6 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="w-12 h-1 bg-bg-border rounded-full mx-auto mb-6" />

        <div className="text-center mb-6">
          <div className="text-6xl mb-3 animate-xp-pop">✅</div>
          <h2 className="text-white font-black text-2xl mb-1">Checked In! 🎉</h2>
          <p className="text-slate-400 text-sm">You showed up. That's all that matters.</p>
        </div>

        {result && (
          <>
            <div className="bg-bg-primary rounded-2xl p-4 mb-4">
              <div className="text-center mb-3">
                <span className="text-xp font-black text-3xl">+{result.xpEarned} XP</span>
              </div>
              <div className="space-y-2">
                {result.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{b.label}</span>
                    <span className="text-xp font-semibold">+{b.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.leveledUp && (
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-accent/40 rounded-2xl p-4 mb-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-white font-bold">Level Up!</div>
                <div className="text-accent font-semibold">You reached Level {result.newLevel}!</div>
              </div>
            )}
          </>
        )}

        <button
          onClick={onClose}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const player = useGameStore(s => s.player);
  const sessions = useGameStore(s => s.sessions);
  const joinSession = useGameStore(s => s.joinSession);
  const leaveSession = useGameStore(s => s.leaveSession);
  const checkIn = useGameStore(s => s.checkIn);
  const cancelSession = useGameStore(s => s.cancelSession);
  const lastCheckinResult = useGameStore(s => s.lastCheckinResult);
  const clearLastCheckinResult = useGameStore(s => s.clearLastCheckinResult);

  const session = sessions.find(s => s.id === id);
  const [checkinState, setCheckinState] = useState<CheckinState>('idle');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (lastCheckinResult) {
      setShowResult(true);
    }
  }, [lastCheckinResult]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-white font-semibold mb-4">Session not found</p>
        <button onClick={() => navigate(-1)} className="text-accent underline">Go back</button>
      </div>
    );
  }

  const cfg = SPORT_CONFIG[session.sport];
  const isHost = player?.id === session.hostId;
  const isJoined = player ? session.currentPlayers.includes(player.name) : false;
  const isCheckedIn = player ? session.checkedIn.includes(player.id) : false;
  const isFull = session.currentPlayers.length >= session.maxPlayers;
  const today = new Date().toISOString().split('T')[0];
  const isToday = session.date === today;

  const handleCheckin = () => {
    if (checkinState !== 'idle' || !player) return;
    setCheckinState('scanning');
    setTimeout(() => {
      checkIn(session.id);
      setCheckinState('done');
    }, 1500);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    clearLastCheckinResult();
    setCheckinState('idle');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero banner */}
      <div
        className="relative h-40 flex items-end px-4 pb-4"
        style={{ backgroundColor: `${cfg.color}20` }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 p-2 rounded-xl bg-black/30 text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-end gap-3">
          <span className="text-5xl">{cfg.icon}</span>
          <div>
            <div className="text-white font-black text-xl leading-tight">{session.title}</div>
            <div className="text-white/70 text-sm">{cfg.label}</div>
          </div>
        </div>
        {isHost && (
          <div className="absolute top-6 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            You're hosting
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full capitalize"
            style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
          >
            {session.status}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-bg-card border border-bg-border text-slate-400 capitalize">
            {session.skillLevel}
          </span>
        </div>

        {/* Info card */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-slate-500 flex-shrink-0" />
            <span className="text-white">{formatDate(session.date, session.time)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-slate-500 flex-shrink-0" />
            <span className="text-white">{session.venue}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users size={16} className="text-slate-500 flex-shrink-0" />
            <span className="text-white">
              <span className="font-semibold" style={{ color: cfg.color }}>
                {session.currentPlayers.length}
              </span> of {session.maxPlayers} players
            </span>
          </div>
          {session.notes && (
            <div className="pt-2 border-t border-bg-border">
              <p className="text-slate-400 text-sm">{session.notes}</p>
            </div>
          )}
        </div>

        {/* Host */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{session.hostAvatar}</span>
            <div>
              <div className="text-white font-semibold">{session.hostName}</div>
              <div className="text-slate-400 text-sm">Session host</div>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-3">Players Joined</h3>
          {session.currentPlayers.length === 0 ? (
            <p className="text-slate-500 text-sm">No one yet — be the first!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {session.currentPlayers.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-bg-primary rounded-full px-3 py-1.5"
                >
                  <span className="text-sm">👤</span>
                  <span className="text-slate-300 text-sm">{name}</span>
                  {session.checkedIn.includes(name) && (
                    <CheckCircle size={12} className="text-green-400" />
                  )}
                </div>
              ))}
            </div>
          )}
          {isFull && (
            <p className="text-red-400 text-xs mt-2 font-semibold">Session is full</p>
          )}
        </div>

        {/* Check-in section — only show on session day */}
        {isToday && (isJoined || isHost) && !isCheckedIn && session.status !== 'cancelled' && (
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-1">Check In Now</h3>
            <p className="text-slate-400 text-sm mb-4">Confirm your attendance and earn XP!</p>

            {checkinState === 'idle' && (
              <button
                onClick={handleCheckin}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
              >
                <QrCode size={20} />
                Check In — Scan QR
              </button>
            )}

            {checkinState === 'scanning' && (
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-green-400 font-semibold">Scanning...</p>
                <p className="text-slate-400 text-sm mt-1">Point at the QR code at the venue</p>
              </div>
            )}

            {checkinState === 'done' && (
              <div className="flex items-center justify-center gap-2 text-green-400 font-bold py-3">
                <CheckCircle size={20} />
                Checked in successfully!
              </div>
            )}
          </div>
        )}

        {isCheckedIn && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400 font-semibold">You checked in to this session!</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {!isHost && !isJoined && !isFull && session.status === 'open' && (
            <button
              onClick={() => { joinSession(session.id); }}
              className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              Join Session
            </button>
          )}

          {!isHost && isJoined && session.status === 'open' && (
            <button
              onClick={() => { leaveSession(session.id); navigate(-1); }}
              className="w-full bg-bg-card border border-bg-border text-slate-300 font-semibold py-4 rounded-2xl transition-all hover:border-red-500/50 hover:text-red-400"
            >
              Leave Session
            </button>
          )}

          {isHost && session.status === 'open' && (
            <button
              onClick={() => { cancelSession(session.id); navigate(-1); }}
              className="w-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold py-4 rounded-2xl transition-all hover:bg-red-500/30"
            >
              Cancel Session
            </button>
          )}
        </div>
      </div>

      {/* Check-in result modal */}
      {showResult && lastCheckinResult && (
        <CheckinModal
          onClose={handleCloseResult}
          result={lastCheckinResult}
        />
      )}
    </div>
  );
}
