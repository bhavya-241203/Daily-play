import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, MapPin, Users, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Sport } from '../../types';

const SPORTS: { id: Sport; icon: string; label: string; desc: string; gradient: string; border: string; glow: string }[] = [
  {
    id: 'cricket',
    icon: '🏏',
    label: 'Cricket',
    desc: 'Bat, bowl, and field',
    gradient: 'from-green-900/60 to-green-800/20',
    border: 'border-sport-cricket/50',
    glow: 'shadow-green-500/30',
  },
  {
    id: 'badminton',
    icon: '🏸',
    label: 'Badminton',
    desc: 'Smash and rally',
    gradient: 'from-amber-900/60 to-amber-800/20',
    border: 'border-sport-badminton/50',
    glow: 'shadow-amber-500/30',
  },
  {
    id: 'pickleball',
    icon: '🏓',
    label: 'Pickleball',
    desc: 'Paddle and net',
    gradient: 'from-cyan-900/60 to-cyan-800/20',
    border: 'border-sport-pickleball/50',
    glow: 'shadow-cyan-500/30',
  },
];

const FORMATS: Record<Sport, { id: string; label: string; desc: string }[]> = {
  cricket: [
    { id: 'T5', label: 'T5', desc: '5 overs per side' },
    { id: 'T10', label: 'T10', desc: '10 overs per side' },
    { id: 'T20', label: 'T20', desc: '20 overs per side' },
    { id: 'Test', label: 'Test', desc: 'Full day match' },
  ],
  badminton: [
    { id: 'Singles (Best of 3)', label: 'Singles', desc: 'Best of 3 sets' },
    { id: 'Doubles (Best of 3)', label: 'Doubles', desc: 'Best of 3 sets, 2v2' },
    { id: 'Casual', label: 'Casual', desc: 'Relaxed match' },
  ],
  pickleball: [
    { id: 'Singles', label: 'Singles', desc: '1v1 match' },
    { id: 'Doubles', label: 'Doubles', desc: '2v2 match' },
    { id: 'Rally Scoring', label: 'Rally', desc: 'Rally scoring format' },
  ],
};

export default function MatchSetup() {
  const navigate = useNavigate();
  const setPendingSession = useGameStore(s => s.setPendingSession);
  const pendingSession = useGameStore(s => s.pendingSession);

  const [step, setStep] = useState(0);
  const [sport, setSport] = useState<Sport>(pendingSession?.sport || 'cricket');
  const [format, setFormat] = useState(pendingSession?.format || '');
  const [venue, setVenue] = useState(pendingSession?.venue || '');
  const [players, setPlayers] = useState<string[]>(pendingSession?.players || []);
  const [newPlayer, setNewPlayer] = useState('');
  const [showGo, setShowGo] = useState(false);

  const handleSportSelect = (s: Sport) => {
    setSport(s);
    setFormat('');
    setStep(1);
  };

  const handleFormatSelect = (f: string) => {
    setFormat(f);
    setStep(2);
  };

  const handleAddPlayer = () => {
    if (newPlayer.trim() && players.length < 4) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleGoPlay = () => {
    setPendingSession({
      sport,
      format,
      venue: venue.trim(),
      players,
      date: new Date().toISOString(),
    });
    setShowGo(true);
  };

  if (showGo) {
    const sc = SPORTS.find(s => s.id === sport)!;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="text-7xl animate-bounce-slow">{sc.icon}</div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">You're All Set!</h1>
            <p className="text-slate-400">
              {sc.label} · {format}
              {venue && ` · ${venue}`}
            </p>
          </div>

          <div className="bg-bg-card border border-bg-border rounded-2xl p-6 space-y-3">
            <p className="text-slate-300 font-semibold">Go play your match!</p>
            <p className="text-slate-500 text-sm">Come back when you're done to record your result and earn XP.</p>
            <div className="flex gap-2 pt-2 justify-center text-3xl">
              {['🏃', '⚡', '🎯', '🏆'].map((e, i) => (
                <span key={i} className="animate-bounce-slow" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/record')}
            className="w-full py-4 bg-gradient-to-r from-sport-cricket to-accent text-white font-black text-lg rounded-xl shadow-lg active:scale-95 transition-all"
          >
            Record Result 📝
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 border border-bg-border text-slate-300 font-semibold rounded-xl hover:bg-bg-card transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white">Match Setup</h1>
        <p className="text-slate-400 text-sm">Set up your session before you play</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {['Sport', 'Format', 'Details'].map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-1.5 ${i <= step ? 'text-white' : 'text-slate-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                i < step ? 'bg-accent border-accent' :
                i === step ? 'border-accent text-accent' :
                'border-slate-700 text-slate-600'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-semibold">{label}</span>
            </div>
            {i < 2 && <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 0: Sport */}
      {step === 0 && (
        <div className="space-y-3 animate-slide-up">
          <h2 className="text-lg font-bold text-white">Choose your sport</h2>
          {SPORTS.map(s => (
            <button
              key={s.id}
              onClick={() => handleSportSelect(s.id)}
              className={`w-full bg-gradient-to-r ${s.gradient} border-2 ${s.border} rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 shadow-lg ${s.glow} active:scale-[0.98] card-hover`}
            >
              <span className="text-5xl">{s.icon}</span>
              <div className="text-left">
                <div className="text-xl font-black text-white">{s.label}</div>
                <div className="text-sm text-slate-400">{s.desc}</div>
              </div>
              <ChevronRight size={20} className="text-slate-400 ml-auto" />
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Format */}
      {step === 1 && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors">← Back</button>
            <h2 className="text-lg font-bold text-white">Choose format</h2>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{SPORTS.find(s => s.id === sport)?.icon}</span>
            <span className="font-bold text-white">{SPORTS.find(s => s.id === sport)?.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FORMATS[sport].map(f => (
              <button
                key={f.id}
                onClick={() => handleFormatSelect(f.id)}
                className={`p-4 border-2 rounded-xl text-left transition-all active:scale-95 ${
                  format === f.id
                    ? 'border-accent bg-accent/20'
                    : 'border-bg-border bg-bg-card hover:border-slate-500'
                }`}
              >
                <div className="font-black text-white text-lg">{f.label}</div>
                <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white transition-colors">← Back</button>
            <h2 className="text-lg font-bold text-white">Session details</h2>
          </div>

          <div className="flex items-center gap-2 bg-bg-card border border-bg-border rounded-xl p-3">
            <span className="text-xl">{SPORTS.find(s => s.id === sport)?.icon}</span>
            <span className="font-semibold text-white">{SPORTS.find(s => s.id === sport)?.label}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">{format}</span>
          </div>

          {/* Venue */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <MapPin size={14} className="text-accent" />
              Venue (optional)
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Local Ground, Sports Hall..."
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 text-sm"
            />
          </div>

          {/* Players */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Users size={14} className="text-accent" />
              Opponents/Players (optional, max 4)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPlayer}
                onChange={e => setNewPlayer(e.target.value)}
                placeholder="Add player name"
                maxLength={20}
                className="flex-1 bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 text-sm"
                onKeyDown={e => e.key === 'Enter' && handleAddPlayer()}
              />
              <button
                onClick={handleAddPlayer}
                disabled={!newPlayer.trim() || players.length >= 4}
                className="p-3 bg-accent/20 border border-accent/30 rounded-xl text-accent hover:bg-accent/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            {players.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-bg-card border border-bg-border rounded-lg px-3 py-1.5">
                    <span className="text-sm text-white">{p}</span>
                    <button
                      onClick={() => setPlayers(players.filter((_, j) => j !== i))}
                      className="text-slate-500 hover:text-loss transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleGoPlay}
            className="w-full py-5 bg-gradient-to-r from-accent to-purple-600 text-white font-black text-xl rounded-xl shadow-lg shadow-accent/30 active:scale-[0.98] transition-all mt-4 glow-accent"
          >
            Go Play! 🚀
          </button>
        </div>
      )}
    </div>
  );
}
