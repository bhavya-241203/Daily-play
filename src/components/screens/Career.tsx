import { useGameStore } from '../../store/gameStore';
import { Zap, Flame, Trophy, Target, Calendar } from 'lucide-react';

const SPORT_CONFIG = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e', barColor: 'bg-sport-cricket' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b', barColor: 'bg-sport-badminton' },
  pickleball: { icon: '🏓', label: 'Pickleball', color: '#06b6d4', barColor: 'bg-sport-pickleball' },
};

export default function Career() {
  const player = useGameStore(s => s.player);
  if (!player) return null;

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));
  const winRate = player.totalMatches > 0
    ? Math.round((player.totalWins / player.totalMatches) * 100)
    : 0;
  const totalXpAllTime = player.sports.cricket.xpEarned +
    player.sports.badminton.xpEarned +
    player.sports.pickleball.xpEarned;

  // Circular progress ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (xpPercent / 100) * circumference;

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-2 pb-4">
        <h1 className="text-2xl font-black text-white">Career Profile</h1>
        <p className="text-slate-400 text-sm">Your sports journey</p>
      </div>

      {/* Level Ring */}
      <div className="bg-gradient-to-br from-bg-card to-accent/10 border border-bg-border rounded-2xl p-6 flex flex-col items-center">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#1e2540"
              strokeWidth="10"
            />
            {/* Progress arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="url(#xpGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
            <defs>
              <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-white">{player.level}</span>
            <span className="text-xs text-slate-400">LEVEL</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-accent/30 to-purple-600/30 border border-accent/40 rounded-full">
            <span className="text-xl font-black text-white tracking-widest uppercase">{player.title}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">{player.xp} / {player.xpToNextLevel} XP to next level</p>
        </div>

        {/* Avatar */}
        <div className="mt-4 text-5xl bg-bg-primary rounded-2xl p-3 border border-bg-border shadow-lg">
          {player.avatar}
        </div>
        <h2 className="mt-2 text-xl font-black text-white">{player.name}</h2>
      </div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Career Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Matches', value: player.totalMatches, icon: <Trophy size={16} className="text-xp" /> },
            { label: 'Total Wins', value: player.totalWins, icon: <Target size={16} className="text-win" /> },
            { label: 'Win Rate', value: `${winRate}%`, icon: <Zap size={16} className="text-accent" /> },
            { label: 'Best Streak', value: `${player.streak} days`, icon: <Flame size={16} className="text-orange-400" /> },
            { label: 'Current Streak', value: `${player.streak} days`, icon: <Calendar size={16} className="text-blue-400" /> },
            { label: 'Total XP', value: totalXpAllTime.toLocaleString(), icon: <span className="text-xp text-sm">✦</span> },
          ].map(stat => (
            <div key={stat.label} className="bg-bg-card border border-bg-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sport Skills */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Sport Skills</h3>
        <div className="bg-bg-card border border-bg-border rounded-xl divide-y divide-bg-border">
          {(Object.entries(SPORT_CONFIG) as [keyof typeof SPORT_CONFIG, typeof SPORT_CONFIG[keyof typeof SPORT_CONFIG]][]).map(([sport, config]) => {
            const stats = player.sports[sport];
            return (
              <div key={sport} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <span className="font-semibold text-white text-sm">{config.label}</span>
                      <span className="text-xs text-slate-500 ml-2">{stats.matches} matches</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white text-lg">{stats.skill}</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
                <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.barColor} rounded-full progress-bar`}
                    style={{ width: `${stats.skill}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-1.5">
                  <span>{stats.wins} wins</span>
                  <span>{stats.xpEarned} XP earned</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Season Record */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">Season Record</h3>
        <div className="bg-gradient-to-r from-bg-card to-accent/5 border border-bg-border rounded-xl p-4">
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{player.seasonMatches}</div>
              <div className="text-xs text-slate-400 mt-1">Matches</div>
            </div>
            <div className="w-px bg-bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-win">{player.seasonWins}</div>
              <div className="text-xs text-slate-400 mt-1">Wins</div>
            </div>
            <div className="w-px bg-bg-border" />
            <div className="text-center">
              <div className="text-3xl font-black text-accent">
                {player.seasonMatches > 0 ? Math.round((player.seasonWins / player.seasonMatches) * 100) : 0}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Win Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Member since */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-600">
          Career started: {new Date(player.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
