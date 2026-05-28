import { useState } from 'react';
import { Lock, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../utils/achievements';
import { Sport } from '../../types';

type FilterTab = 'all' | 'unlocked' | 'locked' | Sport;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unlocked', label: '✓ Unlocked' },
  { id: 'locked', label: '🔒 Locked' },
  { id: 'cricket', label: '🏏 Cricket' },
  { id: 'badminton', label: '🏸 Badminton' },
  { id: 'pickleball', label: '🏓 Pickleball' },
];

export default function Achievements() {
  const player = useGameStore(s => s.player);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  if (!player) return null;

  const unlockedSet = new Set(player.achievements);
  const unlockedCount = unlockedSet.size;
  const totalCount = ACHIEVEMENTS.length;

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unlocked') return unlockedSet.has(a.id);
    if (activeFilter === 'locked') return !unlockedSet.has(a.id);
    if (activeFilter === 'cricket') return a.sport === 'cricket';
    if (activeFilter === 'badminton') return a.sport === 'badminton';
    if (activeFilter === 'pickleball') return a.sport === 'pickleball';
    return true;
  });

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white">Achievements</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <span className="text-xp font-bold">{unlockedCount}</span>
            <span className="text-slate-400 text-sm">/ {totalCount} unlocked</span>
          </div>
          <div className="flex-1 h-1.5 bg-bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-xp to-amber-400 rounded-full progress-bar"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeFilter === tab.id
                ? 'bg-accent/20 border-accent/50 text-accent'
                : 'border-bg-border text-slate-400 hover:border-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements grid */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-400">No achievements in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedSet.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-bg-card to-accent/10 border-accent/30 shadow-lg shadow-accent/10'
                    : 'bg-bg-card border-bg-border opacity-60'
                }`}
              >
                <div className="relative">
                  {/* Icon */}
                  <div className={`text-3xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>

                  {/* Lock overlay */}
                  {!isUnlocked && (
                    <div className="absolute top-0 right-0">
                      <Lock size={14} className="text-slate-600" />
                    </div>
                  )}

                  {/* Unlocked glow indicator */}
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-win rounded-full shadow-sm shadow-win/50" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`font-bold text-sm leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs leading-snug ${isUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {achievement.description}
                  </p>
                </div>

                {/* XP reward */}
                <div className={`mt-2 flex items-center gap-1 ${isUnlocked ? '' : 'opacity-50'}`}>
                  <Zap size={11} className="text-xp" />
                  <span className="text-xp text-xs font-bold">+{achievement.xpReward}</span>
                </div>

                {/* Sport badge */}
                {achievement.sport && (
                  <div className={`mt-2 text-xs px-1.5 py-0.5 rounded-full inline-block ${
                    achievement.sport === 'cricket' ? 'bg-sport-cricket/20 text-sport-cricket' :
                    achievement.sport === 'badminton' ? 'bg-sport-badminton/20 text-sport-badminton' :
                    'bg-sport-pickleball/20 text-sport-pickleball'
                  }`}>
                    {achievement.sport}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
