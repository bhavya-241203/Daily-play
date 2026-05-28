import { useNavigate } from 'react-router-dom';
import { Play, Flame, Zap, Trophy, Target } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Sport } from '../../types';
import { ACHIEVEMENTS } from '../../utils/achievements';

const SPORT_CONFIG: Record<Sport, { icon: string; color: string; label: string }> = {
  cricket: { icon: '🏏', color: 'text-sport-cricket', label: 'Cricket' },
  badminton: { icon: '🏸', color: 'text-sport-badminton', label: 'Badminton' },
  pickleball: { icon: '🏓', color: 'text-sport-pickleball', label: 'Pickleball' },
};

const RESULT_STYLES: Record<string, string> = {
  win: 'bg-win/20 text-win border-win/30',
  loss: 'bg-loss/20 text-loss border-loss/30',
  draw: 'bg-draw/20 text-draw border-draw/30',
  'no-result': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

// Deterministic daily challenge based on date seed
function getDailyChallenge(dateStr: string) {
  const seed = dateStr.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  const challenges = [
    { sport: 'cricket' as Sport, description: 'Score 50+ runs in a T20 match', xpReward: 150 },
    { sport: 'badminton' as Sport, description: 'Win a best-of-3 set match', xpReward: 120 },
    { sport: 'pickleball' as Sport, description: 'Win a doubles game 11-0', xpReward: 200 },
    { sport: 'cricket' as Sport, description: 'Take 3+ wickets in a T10 match', xpReward: 175 },
    { sport: 'badminton' as Sport, description: 'Win a game without losing 5 consecutive points', xpReward: 130 },
    { sport: 'pickleball' as Sport, description: 'Win a singles match 3-0', xpReward: 140 },
    { sport: 'cricket' as Sport, description: 'Play a T20 match and win by 20+ runs', xpReward: 160 },
    { sport: 'badminton' as Sport, description: 'Win 2 sets in a row', xpReward: 110 },
    { sport: 'pickleball' as Sport, description: 'Win a rally scoring game 15-10+', xpReward: 145 },
    { sport: 'cricket' as Sport, description: 'Complete a full Test match', xpReward: 250 },
  ];
  return challenges[seed % challenges.length];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const player = useGameStore(s => s.player);
  const sessions = useGameStore(s => s.sessions);

  if (!player) return null;

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date.startsWith(today));
  const todayXp = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0);
  const hasPlayedToday = todaySessions.length > 0;

  const recentSessions = [...sessions].reverse().slice(0, 3);
  const winRate = player.totalMatches > 0
    ? Math.round((player.totalWins / player.totalMatches) * 100)
    : 0;

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));
  const dailyChallenge = getDailyChallenge(today);

  const unlockedCount = player.achievements.length;
  const latestAchievements = player.achievements
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)
    .slice(-3)
    .reverse();

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Player Card */}
      <div className="bg-gradient-to-br from-bg-card via-bg-card to-accent/10 border border-bg-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl bg-bg-primary rounded-2xl p-2 shadow-lg">{player.avatar}</div>
            <div>
              <h2 className="text-xl font-black text-white">{player.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-semibold border border-accent/30">
                  {player.title}
                </span>
                <span className="text-xs text-slate-400">Lv.{player.level}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 rounded-xl px-3 py-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-orange-300 font-bold text-sm">{player.streak}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-xp font-bold flex items-center gap-1">
              <Zap size={12} /> {player.xp} XP
            </span>
            <span className="text-slate-500">{player.xpToNextLevel} XP to Lv.{player.level + 1}</span>
          </div>
          <div className="h-2.5 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-xp to-amber-400 rounded-full progress-bar"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="text-right text-xs text-slate-600">{xpPercent}%</div>
        </div>
      </div>

      {/* Today's Scene */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Today's Scene</h3>

        {/* Main CTA */}
        <button
          onClick={() => navigate('/play')}
          className="w-full py-5 bg-gradient-to-r from-accent via-purple-600 to-indigo-700 rounded-2xl font-black text-white text-xl shadow-lg shadow-accent/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 glow-accent"
        >
          <Play size={24} fill="white" />
          {hasPlayedToday ? 'PLAY AGAIN' : 'PLAY TODAY'}
        </button>

        {hasPlayedToday && (
          <div className="bg-bg-card border border-bg-border rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-accent" />
              <span className="text-sm text-slate-300">Today's sessions: <span className="font-bold text-white">{todaySessions.length}</span></span>
            </div>
            <span className="text-xp font-bold text-sm">+{todayXp} XP</span>
          </div>
        )}

        {/* Daily Challenge */}
        <div className={`bg-bg-card border border-bg-border rounded-xl p-4 ${
          dailyChallenge.sport === 'cricket' ? 'border-l-2 border-l-sport-cricket' :
          dailyChallenge.sport === 'badminton' ? 'border-l-2 border-l-sport-badminton' :
          'border-l-2 border-l-sport-pickleball'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{SPORT_CONFIG[dailyChallenge.sport].icon}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Daily Challenge</span>
              </div>
              <p className="text-sm text-white font-medium">{dailyChallenge.description}</p>
            </div>
            <div className="flex items-center gap-1 bg-xp/10 border border-xp/20 rounded-lg px-2 py-1 whitespace-nowrap">
              <Zap size={12} className="text-xp" />
              <span className="text-xp text-xs font-bold">+{dailyChallenge.xpReward}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">This Season</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Matches', value: player.seasonMatches, icon: '🎮' },
            { label: 'Wins', value: player.seasonWins, icon: '🏆' },
            { label: 'Win Rate', value: `${winRate}%`, icon: '📊' },
          ].map(stat => (
            <div key={stat.label} className="bg-bg-card border border-bg-border rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements preview */}
      {unlockedCount > 0 && (
        <div>
          <div className="flex justify-between items-center px-1 mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Badges</h3>
            <button onClick={() => navigate('/achievements')} className="text-xs text-accent">View all →</button>
          </div>
          <div className="flex gap-2">
            {latestAchievements.map(a => a && (
              <div key={a.id} className="flex-1 bg-bg-card border border-bg-border rounded-xl p-3 text-center glow-accent">
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-semibold text-white truncate">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Matches */}
      <div>
        <div className="flex justify-between items-center px-1 mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Matches</h3>
          <button onClick={() => navigate('/history')} className="text-xs text-accent">See all →</button>
        </div>

        {recentSessions.length === 0 ? (
          <div className="bg-bg-card border border-bg-border rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p className="text-slate-400 text-sm">No matches yet. Hit Play to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map(session => {
              const sc = SPORT_CONFIG[session.sport];
              return (
                <div key={session.id} className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{sc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{sc.label}</span>
                      <span className="text-xs text-slate-500">· {session.format}</span>
                    </div>
                    {session.score && (
                      <p className="text-xs text-slate-400 truncate">{session.score}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold uppercase ${RESULT_STYLES[session.result]}`}>
                      {session.result === 'no-result' ? 'NR' : session.result.charAt(0).toUpperCase() + session.result.slice(1)}
                    </span>
                    <span className="text-xp text-xs font-semibold">+{session.xpEarned}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trophy teaser */}
      <div
        onClick={() => navigate('/career')}
        className="bg-gradient-to-r from-bg-card to-accent/10 border border-bg-border rounded-xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
      >
        <Trophy size={24} className="text-xp" />
        <div className="flex-1">
          <p className="text-sm font-bold text-white">View Career Profile</p>
          <p className="text-xs text-slate-400">{unlockedCount} achievements · Level {player.level}</p>
        </div>
        <span className="text-slate-400 text-sm">→</span>
      </div>
    </div>
  );
}
