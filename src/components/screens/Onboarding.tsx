import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Sport, SkillLevel } from '../../types';

const SPORT_OPTIONS: { value: Sport; label: string; icon: string }[] = [
  { value: 'cricket', label: 'Cricket', icon: '🏏' },
  { value: 'badminton', label: 'Badminton', icon: '🏸' },
  { value: 'pickleball', label: 'Pickleball', icon: '🥒' },
  { value: 'football', label: 'Football', icon: '⚽' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'ps5', label: 'PS5', icon: '🎮' },
];

const AVATAR_OPTIONS = ['🦁', '🐯', '🦊', '🐺', '🦅', '🐻', '🦋', '🐉', '⚡', '🔥'];
const CITIES = ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Delhi', 'Chennai', 'Kolkata'];

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const FLOATING_EMOJIS = ['🏏', '🏸', '🥒', '⚽', '💪', '🎮'];

export default function Onboarding() {
  const createPlayer = useGameStore(s => s.createPlayer);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [avatar, setAvatar] = useState('🦁');
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [skillLevels, setSkillLevels] = useState<Partial<Record<Sport, SkillLevel>>>({});
  const [nameError, setNameError] = useState('');

  const toggleSport = (sport: Sport) => {
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setNameError('Please enter your name');
        return;
      }
      setNameError('');
    }
    if (step === 2 && selectedSports.length === 0) return;
    setStep(s => s + 1);
  };

  const handleStart = () => {
    if (!name.trim()) return;
    createPlayer({ name: name.trim(), avatar, city, sports: selectedSports, skillLevels });
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes confetti-in {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
          60% { transform: scale(1.15) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .confetti-in { animation: confetti-in 0.7s ease-out forwards; }
        .float-emoji { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* Progress dots */}
      {step > 0 && (
        <div className="flex items-center justify-center gap-2 pt-10 pb-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i <= step ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-bg-border'
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 0 — Welcome */}
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
          {FLOATING_EMOJIS.map((emoji, i) => (
            <div
              key={i}
              className="float-emoji absolute text-4xl select-none pointer-events-none"
              style={{
                top: `${8 + ((i * 14) % 58)}%`,
                left: i % 2 === 0 ? `${4 + i * 4}%` : `${58 + (i % 3) * 11}%`,
                animationDelay: `${i * 0.45}s`,
                opacity: 0.25,
              }}
            >
              {emoji}
            </div>
          ))}
          <div className="relative z-10 text-center animate-fade-in">
            <div className="text-7xl mb-5">🏆</div>
            <h1 className="text-5xl font-black tracking-tight mb-3">
              <span className="text-gradient-accent">Daily</span>{' '}
              <span className="text-white">Play</span>
            </h1>
            <p className="text-slate-300 text-xl font-semibold mb-2">Find your game. Show up. Repeat.</p>
            <p className="text-slate-500 text-sm mb-14">Social sports coordination for real players.</p>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 mx-auto bg-accent hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-200 shadow-lg glow-accent active:scale-95"
            >
              Let's Go <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Profile */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-8 animate-slide-up">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
            <p className="text-slate-400">Tell us a bit about yourself</p>
          </div>

          <div className="mb-6">
            <label className="block text-slate-400 text-sm font-medium mb-3">Pick your avatar</label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`text-3xl p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                    avatar === a
                      ? 'border-accent bg-accent/20 scale-110'
                      : 'border-bg-border bg-bg-card hover:border-slate-500'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-slate-400 text-sm font-medium mb-2">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              placeholder="e.g. Rahul K."
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            />
            {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
          </div>

          <div className="mb-8">
            <label className="block text-slate-400 text-sm font-medium mb-2">Your city</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
            >
              {CITIES.map(c => (
                <option key={c} value={c} className="bg-bg-card">{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNext}
            className="mt-auto w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 active:scale-95"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2 — Sports */}
      {step === 2 && (
        <div className="flex-1 flex flex-col px-6 pt-4 pb-8 animate-slide-up overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Your Sports</h2>
            <p className="text-slate-400">Pick the ones you play (or want to try)</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {SPORT_OPTIONS.map(sport => {
              const selected = selectedSports.includes(sport.value);
              return (
                <button
                  key={sport.value}
                  onClick={() => toggleSport(sport.value)}
                  className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                    selected
                      ? 'border-accent bg-accent/10'
                      : 'border-bg-border bg-bg-card hover:border-slate-500'
                  }`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                  <span className="text-3xl">{sport.icon}</span>
                  <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-slate-400'}`}>
                    {sport.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Skill levels for selected sports */}
          {selectedSports.length > 0 && (
            <div className="mb-5">
              <p className="text-slate-400 text-sm font-medium mb-3">Your skill level:</p>
              {selectedSports.map(sport => {
                const sportInfo = SPORT_OPTIONS.find(s => s.value === sport)!;
                return (
                  <div key={sport} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{sportInfo.icon}</span>
                      <span className="text-white text-sm font-medium">{sportInfo.label}</span>
                    </div>
                    <div className="flex gap-2">
                      {SKILL_LEVELS.map(sl => (
                        <button
                          key={sl.value}
                          onClick={() => setSkillLevels(prev => ({ ...prev, [sport]: sl.value }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                            skillLevels[sport] === sl.value
                              ? 'bg-accent text-white'
                              : 'bg-bg-card border border-bg-border text-slate-400 hover:border-accent/50'
                          }`}
                        >
                          {sl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={selectedSports.length === 0}
            className="mt-auto w-full bg-accent hover:bg-indigo-500 disabled:bg-bg-border disabled:text-slate-500 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 active:scale-95"
          >
            {selectedSports.length > 0 ? `Continue (${selectedSports.length} selected)` : 'Select at least one sport'}
          </button>
        </div>
      )}

      {/* Step 3 — You're in! */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-8xl mb-5 confetti-in">{avatar}</div>
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 rounded-full px-4 py-1.5 mb-4">
            <span className="text-accent font-bold text-sm">⭐ Level 1 Rookie</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{name}</h2>
          <p className="text-slate-400 text-base mb-1">{city}</p>
          <p className="text-slate-400 text-sm mb-2">
            {selectedSports.map(s => SPORT_OPTIONS.find(o => o.value === s)?.icon).join(' ')}
          </p>
          <p className="text-accent font-bold text-xl mb-10">Your career starts today ✨</p>

          <div className="w-full bg-bg-card border border-bg-border rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">XP to Level 2</span>
              <span className="text-white text-sm font-bold">0 / 200</span>
            </div>
            <div className="h-2 bg-bg-border rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full w-0 progress-bar" />
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-xl transition-all duration-200 shadow-lg glow-accent active:scale-95"
          >
            Start Playing 🎮
          </button>
        </div>
      )}
    </div>
  );
}
