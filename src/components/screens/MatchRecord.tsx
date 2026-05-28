import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { MatchResult, Sport } from '../../types';
import { getAchievementById } from '../../utils/achievements';

const RESULT_OPTIONS: { id: MatchResult; label: string; emoji: string; style: string; activeStyle: string }[] = [
  { id: 'win', label: 'Win', emoji: '🏆', style: 'border-bg-border bg-bg-card', activeStyle: 'border-win bg-win/20 shadow-lg shadow-win/20' },
  { id: 'loss', label: 'Loss', emoji: '😤', style: 'border-bg-border bg-bg-card', activeStyle: 'border-loss bg-loss/20 shadow-lg shadow-loss/20' },
  { id: 'draw', label: 'Draw', emoji: '🤝', style: 'border-bg-border bg-bg-card', activeStyle: 'border-draw bg-draw/20' },
  { id: 'no-result', label: 'No Result', emoji: '🚫', style: 'border-bg-border bg-bg-card', activeStyle: 'border-slate-500 bg-slate-500/20' },
];

const SPORT_SCORE_PLACEHOLDERS: Record<Sport, { mine: string; theirs: string; hint: string }> = {
  cricket: {
    mine: 'e.g. 145/8',
    theirs: 'e.g. 132 all out',
    hint: 'runs/wickets format',
  },
  badminton: {
    mine: 'e.g. 21-18, 18-21, 21-15',
    theirs: 'e.g. 18-21, 21-18, 15-21',
    hint: 'set scores',
  },
  pickleball: {
    mine: 'e.g. 11-8, 9-11, 11-7',
    theirs: 'e.g. 8-11, 11-9, 7-11',
    hint: 'game scores',
  },
};

export default function MatchRecord() {
  const navigate = useNavigate();
  const pendingSession = useGameStore(s => s.pendingSession);
  const lastXpResult = useGameStore(s => s.lastXpResult);
  const player = useGameStore(s => s.player);
  const recordMatch = useGameStore(s => s.recordMatch);
  const clearLastXpResult = useGameStore(s => s.clearLastXpResult);

  const [result, setResult] = useState<MatchResult | null>(null);
  const [myScore, setMyScore] = useState('');
  const [theirScore, setTheirScore] = useState('');
  const [notes, setNotes] = useState('');
  const [showXpAnim, setShowXpAnim] = useState(false);

  useEffect(() => {
    if (lastXpResult) {
      setShowXpAnim(true);
    }
  }, [lastXpResult]);

  if (!pendingSession?.sport && !showXpAnim) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="text-6xl">🎮</div>
        <h2 className="text-xl font-bold text-white">No active match session</h2>
        <p className="text-slate-400 text-sm">Set up a match first before recording results.</p>
        <button
          onClick={() => navigate('/play')}
          className="px-6 py-3 bg-accent text-white font-bold rounded-xl"
        >
          Set Up Match
        </button>
      </div>
    );
  }

  const handleSave = () => {
    if (!result) return;
    const sport = pendingSession!.sport!;
    const scoreStr = myScore || theirScore
      ? `${sport === 'cricket' ? 'Your score: ' : ''}${myScore}${theirScore ? ` vs ${theirScore}` : ''}`
      : '';
    recordMatch(result, scoreStr, notes);
  };

  // XP Animation Screen
  if (showXpAnim && lastXpResult && player) {
    const newAchievements = lastXpResult.newAchievements
      .map(id => getAchievementById(id))
      .filter(Boolean);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary relative overflow-hidden animate-fade-in">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-xp/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-sm w-full">
          {/* XP Pop */}
          <div className="animate-xp-pop">
            <div className="text-8xl font-black text-xp drop-shadow-lg">
              +{lastXpResult.xpEarned}
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">XP EARNED!</div>
          </div>

          {/* Level up */}
          {lastXpResult.leveledUp && (
            <div className="bg-gradient-to-r from-accent/30 to-purple-600/30 border border-accent/50 rounded-2xl p-4 animate-scale-in">
              <div className="text-4xl mb-2">⬆️</div>
              <div className="text-xl font-black text-white">LEVEL UP!</div>
              <div className="text-accent font-bold">Now Level {player.level} · {player.title}</div>
            </div>
          )}

          {/* XP Breakdown */}
          <div className="bg-bg-card border border-bg-border rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-xp" />
              <span className="font-bold text-white text-sm">XP Breakdown</span>
            </div>
            <div className="space-y-1.5">
              {lastXpResult.breakdown.map((line, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-400">{line.split('+')[0] || ''}</span>
                  <span className="text-xp font-semibold">+{line.split('+')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Achievements */}
          {newAchievements.length > 0 && (
            <div className="bg-bg-card border border-xp/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} className="text-xp" />
                <span className="font-bold text-white text-sm">New Achievements!</span>
              </div>
              <div className="space-y-2">
                {newAchievements.map(a => a && (
                  <div key={a.id} className="flex items-center gap-3 bg-xp/10 border border-xp/20 rounded-lg p-2">
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <div className="font-bold text-white text-sm">{a.name}</div>
                      <div className="text-xs text-slate-400">{a.description}</div>
                    </div>
                    <span className="ml-auto text-xp font-bold text-sm">+{a.xpReward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* XP bar preview */}
          <div className="bg-bg-card border border-bg-border rounded-xl p-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white font-bold">Level {player.level}</span>
              <span className="text-slate-400">{player.xp} / {player.xpToNextLevel} XP</span>
            </div>
            <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-xp to-amber-400 rounded-full progress-bar"
                style={{ width: `${Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100))}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                clearLastXpResult();
                navigate('/career');
              }}
              className="flex-1 py-3.5 border border-bg-border text-slate-300 font-bold rounded-xl hover:bg-bg-card transition-all"
            >
              View Career
            </button>
            <button
              onClick={() => {
                clearLastXpResult();
                navigate('/play');
              }}
              className="flex-1 py-3.5 bg-gradient-to-r from-accent to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-accent/30 active:scale-95 transition-all"
            >
              Play Again 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sport = pendingSession!.sport!;
  const scorePlaceholders = SPORT_SCORE_PLACEHOLDERS[sport];

  const SPORT_ICONS: Record<Sport, string> = { cricket: '🏏', badminton: '🏸', pickleball: '🏓' };

  return (
    <div className="p-4 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white">Record Result</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg">{SPORT_ICONS[sport]}</span>
          <span className="text-slate-400 text-sm capitalize">{sport} · {pendingSession?.format}</span>
          {pendingSession?.venue && (
            <>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-sm">{pendingSession.venue}</span>
            </>
          )}
        </div>
      </div>

      {/* Result selector */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">What was the result?</h2>
        <div className="grid grid-cols-2 gap-3">
          {RESULT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setResult(opt.id)}
              className={`py-5 border-2 rounded-xl transition-all duration-200 active:scale-95 ${
                result === opt.id ? opt.activeStyle : opt.style
              }`}
            >
              <div className="text-3xl mb-1">{opt.emoji}</div>
              <div className={`font-bold text-base ${result === opt.id ? 'text-white' : 'text-slate-300'}`}>
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Score entry */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
          Score <span className="text-slate-600 normal-case font-normal">({scorePlaceholders.hint})</span>
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Your score / team</label>
            <input
              type="text"
              value={myScore}
              onChange={e => setMyScore(e.target.value)}
              placeholder={scorePlaceholders.mine}
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Opponent score</label>
            <input
              type="text"
              value={theirScore}
              onChange={e => setTheirScore(e.target.value)}
              placeholder={scorePlaceholders.theirs}
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Notes (optional)</h2>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How did it go? Any highlights?"
          rows={3}
          className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent/60 text-sm resize-none"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!result}
        className="w-full py-5 bg-gradient-to-r from-xp to-amber-500 text-black font-black text-xl rounded-xl shadow-lg shadow-xp/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all glow-xp"
      >
        Save & Earn XP ⚡
      </button>
    </div>
  );
}
