import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Plus, Minus } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Tournament, Sport } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4' },
  football: { icon: '⚽', label: 'Football', color: '#f97316' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function RegisterSheet({
  tournament,
  onClose,
  onRegister,
}: {
  tournament: Tournament;
  onClose: () => void;
  onRegister: (teamName: string, players: string[]) => void;
}) {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updatePlayer = (i: number, val: string) => {
    const updated = [...players];
    updated[i] = val;
    setPlayers(updated);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!teamName.trim()) e.teamName = 'Enter your team name';
    const filledPlayers = players.filter(p => p.trim());
    if (filledPlayers.length < 2) e.players = 'Add at least 2 players';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onRegister(teamName.trim(), players.filter(p => p.trim()));
  };

  const cfg = SPORT_CONFIG[tournament.sport];

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl p-6 animate-slide-up"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="w-12 h-1 bg-bg-border rounded-full mx-auto mb-5" />

        <h2 className="text-white font-bold text-lg mb-1">Register for</h2>
        <div className="flex items-center gap-2 mb-5">
          <span>{cfg.icon}</span>
          <span className="text-white font-black">{tournament.name}</span>
        </div>

        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Team name {errors.teamName && <span className="text-red-400 ml-2 text-xs">{errors.teamName}</span>}
          </label>
          <input
            type="text"
            value={teamName}
            onChange={e => { setTeamName(e.target.value); setErrors(er => ({ ...er, teamName: '' })); }}
            placeholder="e.g. Koramangala XI"
            className="w-full bg-bg-primary border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="mb-5">
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Players {errors.players && <span className="text-red-400 ml-2 text-xs">{errors.players}</span>}
          </label>
          {players.map((p, i) => (
            <input
              key={i}
              type="text"
              value={p}
              onChange={e => { updatePlayer(i, e.target.value); setErrors(er => ({ ...er, players: '' })); }}
              placeholder={`Player ${i + 1}${i < 2 ? ' *' : ' (optional)'}`}
              className="w-full bg-bg-primary border border-bg-border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors mb-2"
            />
          ))}
        </div>

        <div className="bg-bg-primary rounded-xl p-3 mb-5 text-sm text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Entry fee</span>
            <span className="text-white font-semibold">₹{tournament.entryFee} per team</span>
          </div>
          <div className="flex justify-between">
            <span>Prize pool</span>
            <span className="text-yellow-400 font-semibold">₹{tournament.prizePool}</span>
          </div>
          <div className="flex justify-between">
            <span>Format</span>
            <span className="text-white capitalize">{tournament.format}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
        >
          Register Team 🏆
        </button>
      </div>
    </div>
  );
}

function SuccessSheet({ tournament, teamName, onClose }: {
  tournament: Tournament;
  teamName: string;
  onClose: () => void;
}) {
  const cfg = SPORT_CONFIG[tournament.sport];
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl p-6 animate-slide-up text-center">
        <div className="w-12 h-1 bg-bg-border rounded-full mx-auto mb-6" />
        <div className="text-6xl mb-3">🎉</div>
        <h2 className="text-white font-black text-2xl mb-2">You're Registered!</h2>
        <p className="text-slate-400 mb-1">Team: <span className="text-white font-semibold">{teamName}</span></p>
        <p className="text-slate-400 text-sm mb-6">
          See you at <span style={{ color: cfg.color }}>{tournament.name}</span> on {formatDate(tournament.date)}
        </p>
        <div className="bg-bg-primary rounded-xl p-4 mb-5 text-sm text-slate-400">
          <p>Score logging and brackets are managed by the host turf.</p>
          <p className="text-accent mt-1">Coming soon in Daily Play 🚀</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

export default function Tournaments() {
  const navigate = useNavigate();
  const tournaments = useGameStore(s => s.tournaments);
  const registerTournament = useGameStore(s => s.registerTournament);

  const [registerTarget, setRegisterTarget] = useState<Tournament | null>(null);
  const [successData, setSuccessData] = useState<{ tournament: Tournament; teamName: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRegister = (teamName: string, players: string[]) => {
    if (!registerTarget) return;
    registerTournament(registerTarget.id, teamName, players);
    setSuccessData({ tournament: registerTarget, teamName });
    setRegisterTarget(null);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-bg-card border border-bg-border text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-white font-black text-xl">Tournaments</h1>
      </div>

      {/* Info banner */}
      <div className="mx-4 mb-5 bg-amber-900/20 border border-amber-500/20 rounded-2xl p-4">
        <p className="text-amber-300 text-sm font-medium">
          🏆 Tournaments are where scores matter.{' '}
          <span className="text-amber-400/70 font-normal">Daily play is just about showing up.</span>
        </p>
      </div>

      <div className="px-4 space-y-4">
        {tournaments.map(t => {
          const cfg = SPORT_CONFIG[t.sport];
          const spotsLeft = t.maxTeams - t.registeredTeams.length;
          const isExpanded = expandedId === t.id;

          return (
            <div key={t.id} className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${cfg.color}20` }}
                    >
                      {cfg.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold">{t.name}</div>
                      <div className="text-slate-400 text-xs">{t.city} · {t.venueName}</div>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full capitalize flex-shrink-0"
                    style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 bg-bg-primary rounded-xl p-3">
                  <div>
                    <div className="text-slate-500 text-xs">Date</div>
                    <div className="text-white text-sm font-medium">
                      {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Format</div>
                    <div className="text-white text-sm font-medium capitalize">{t.format}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Entry fee</div>
                    <div className="text-white text-sm font-medium">₹{t.entryFee}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Prize pool</div>
                    <div className="text-yellow-400 text-sm font-bold">₹{t.prizePool}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-400">
                    <span className="font-semibold text-white">{t.registeredTeams.length}</span>
                    <span> / {t.maxTeams} teams</span>
                    {spotsLeft > 0 && (
                      <span className="text-green-400 ml-2 text-xs">{spotsLeft} spots left</span>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                    Teams
                  </button>
                </div>

                {isExpanded && t.registeredTeams.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    {t.registeredTeams.map((team, i) => (
                      <div key={i} className="flex items-center gap-2 bg-bg-primary rounded-lg px-3 py-2 text-sm">
                        <span className="text-slate-400 font-mono w-5">{i + 1}.</span>
                        <span className="text-white font-medium">{team.name}</span>
                        <span className="text-slate-500 text-xs ml-auto">{team.players.length} players</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setRegisterTarget(t)}
                  disabled={spotsLeft <= 0 || t.status !== 'upcoming'}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    spotsLeft <= 0 || t.status !== 'upcoming'
                      ? 'bg-bg-border text-slate-500 cursor-not-allowed'
                      : 'bg-accent hover:bg-indigo-500 text-white'
                  }`}
                >
                  {spotsLeft <= 0 ? 'Tournament Full' : 'Register Your Team'}
                </button>

                <p className="text-slate-600 text-xs text-center mt-2">
                  Scores & brackets managed by the host turf · Coming soon in app
                </p>
              </div>
            </div>
          );
        })}

        {tournaments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-slate-400">No tournaments yet</p>
            <p className="text-slate-500 text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </div>

      {registerTarget && (
        <RegisterSheet
          tournament={registerTarget}
          onClose={() => setRegisterTarget(null)}
          onRegister={handleRegister}
        />
      )}

      {successData && (
        <SuccessSheet
          tournament={successData.tournament}
          teamName={successData.teamName}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
}
