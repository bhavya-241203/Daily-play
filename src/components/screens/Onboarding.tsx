import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Sport } from '../../types';

const AVATARS = ['🦁', '🐯', '🦊', '🐺', '🦅', '🐻', '🦋', '🐉', '⚡', '🔥'];

const SPORTS: { id: Sport; label: string; icon: string; color: string }[] = [
  { id: 'cricket', label: 'Cricket', icon: '🏏', color: 'from-green-500/30 to-green-600/10 border-green-500/40' },
  { id: 'badminton', label: 'Badminton', icon: '🏸', color: 'from-amber-500/30 to-amber-600/10 border-amber-500/40' },
  { id: 'pickleball', label: 'Pickleball', icon: '🏓', color: 'from-cyan-500/30 to-cyan-600/10 border-cyan-500/40' },
];

const FLOATING_EMOJIS = ['🏏', '🏸', '🏓', '⚡', '🔥', '🏆', '⭐', '💫'];

export default function Onboarding() {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [sport, setSport] = useState<Sport>('cricket');
  const [step, setStep] = useState(0);
  const createPlayer = useGameStore(s => s.createPlayer);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) return;
    createPlayer(name.trim(), avatar, sport);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating background emojis */}
      {FLOATING_EMOJIS.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-10 animate-bounce-slow pointer-events-none select-none"
          style={{
            left: `${(i * 13 + 5) % 90}%`,
            top: `${(i * 17 + 10) % 80}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-sport-cricket/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce-slow">🏆</div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            Daily <span className="text-gradient-accent">Play</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Track your sports journey. Earn XP. Level up.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-accent' : i < step ? 'w-4 bg-accent/60' : 'w-4 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step 0: Name */}
        {step === 0 && (
          <div className="animate-slide-up space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your player name"
                maxLength={20}
                className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 text-base"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(1)}
              />
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!name.trim()}
              className="w-full py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 active:scale-95 text-base"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 1: Avatar */}
        {step === 1 && (
          <div className="animate-slide-up space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Pick your avatar
              </label>
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map(a => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-3xl p-3 rounded-xl border-2 transition-all duration-200 active:scale-90 ${
                      avatar === a
                        ? 'border-accent bg-accent/20 shadow-lg shadow-accent/30 scale-110'
                        : 'border-bg-border bg-bg-card hover:border-slate-500'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-4 border border-bg-border text-slate-300 font-semibold rounded-xl hover:bg-bg-card transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 active:scale-95"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Favorite sport */}
        {step === 2 && (
          <div className="animate-slide-up space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Favorite sport?
              </label>
              <div className="space-y-3">
                {SPORTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSport(s.id)}
                    className={`w-full p-4 rounded-xl border-2 bg-gradient-to-r text-left flex items-center gap-4 transition-all duration-200 ${
                      sport === s.id
                        ? `${s.color} shadow-lg scale-[1.02]`
                        : 'border-bg-border bg-bg-card hover:border-slate-600'
                    }`}
                  >
                    <span className="text-3xl">{s.icon}</span>
                    <span className="font-bold text-white text-lg">{s.label}</span>
                    {sport === s.id && <span className="ml-auto text-white">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border border-bg-border text-slate-300 font-semibold rounded-xl hover:bg-bg-card transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleStart}
                className="flex-1 py-4 bg-gradient-to-r from-sport-cricket to-accent text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-base"
              >
                Start Career! 🚀
              </button>
            </div>
          </div>
        )}

        {/* Preview card */}
        {name.trim() && step > 0 && (
          <div className="mt-6 p-4 bg-bg-card border border-bg-border rounded-xl flex items-center gap-3 animate-fade-in">
            <span className="text-3xl">{avatar}</span>
            <div>
              <p className="font-bold text-white">{name}</p>
              <p className="text-xs text-slate-400">Level 1 Rookie</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
