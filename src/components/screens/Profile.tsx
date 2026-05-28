import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, X, Check } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../utils/achievements';
import { Sport, SkillLevel } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4' },
  football: { icon: '⚽', label: 'Football', color: '#f97316' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6' },
};

const AVATAR_OPTIONS = ['🦁', '🐯', '🦊', '🐺', '🦅', '🐻', '🦋', '🐉', '⚡', '🔥'];
const CITIES = ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Delhi', 'Chennai', 'Kolkata'];
const SPORTS_ALL: Sport[] = ['cricket', 'badminton', 'pickleball', 'football', 'gym', 'ps5'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

function EditModal({ onClose }: { onClose: () => void }) {
  const player = useGameStore(s => s.player);
  const updatePlayer = useGameStore(s => s.updatePlayer);

  const [name, setName] = useState(player?.name ?? '');
  const [city, setCity] = useState(player?.city ?? 'Bangalore');
  const [avatar, setAvatar] = useState(player?.avatar ?? '🦁');
  const [sports, setSports] = useState<Sport[]>(player?.sports ?? []);
  const [skillLevels, setSkillLevels] = useState<Partial<Record<Sport, SkillLevel>>>(player?.skillLevels ?? {});

  const toggleSport = (sport: Sport) => {
    setSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updatePlayer({ name: name.trim(), city, sports, skillLevels });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl p-5 animate-slide-up"
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <div className="w-12 h-1 bg-bg-border rounded-full mx-auto mb-5" />
        <h2 className="text-white font-bold text-lg mb-4">Edit Profile</h2>

        {/* Avatar */}
        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-2">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`text-2xl p-2.5 rounded-xl border-2 transition-all ${
                  avatar === a ? 'border-accent bg-accent/20' : 'border-bg-border bg-bg-primary'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-bg-primary border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-slate-400 text-sm font-medium mb-2">City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full bg-bg-primary border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
          >
            {CITIES.map(c => (
              <option key={c} value={c} className="bg-bg-primary">{c}</option>
            ))}
          </select>
        </div>

        {/* Sports */}
        <div className="mb-5">
          <label className="block text-slate-400 text-sm font-medium mb-2">Sports</label>
          <div className="grid grid-cols-3 gap-2">
            {SPORTS_ALL.map(sport => (
              <button
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                  sports.includes(sport) ? 'border-accent bg-accent/10' : 'border-bg-border bg-bg-primary'
                }`}
              >
                {sports.includes(sport) && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </div>
                )}
                <span>{SPORT_CONFIG[sport].icon}</span>
                <span className={`text-xs ${sports.includes(sport) ? 'text-white' : 'text-slate-500'}`}>
                  {SPORT_CONFIG[sport].label}
                </span>
              </button>
            ))}
          </div>
          {sports.length > 0 && (
            <div className="mt-3 space-y-2">
              {sports.map(sport => (
                <div key={sport} className="flex items-center gap-2">
                  <span className="text-sm w-5">{SPORT_CONFIG[sport].icon}</span>
                  <div className="flex gap-1.5 flex-1">
                    {SKILL_LEVELS.map(sl => (
                      <button
                        key={sl}
                        onClick={() => setSkillLevels(prev => ({ ...prev, [sport]: sl }))}
                        className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                          skillLevels[sport] === sl ? 'bg-accent text-white' : 'bg-bg-primary border border-bg-border text-slate-400'
                        }`}
                      >
                        {sl.charAt(0).toUpperCase() + sl.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const player = useGameStore(s => s.player);
  const [showEdit, setShowEdit] = useState(false);

  if (!player) return null;

  const xpPercent = Math.min(100, Math.round((player.xp / player.xpToNextLevel) * 100));

  const sportsSorted = SPORTS_ALL
    .map(sport => ({ sport, count: player.sportsPlayed[sport] ?? 0 }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(1, ...sportsSorted.map(s => s.count));

  const uniqueSportsPlayed = Object.values(player.sportsPlayed).filter(n => (n ?? 0) > 0).length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-bg-card border border-bg-border text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-white font-black text-xl">Profile</h1>
        <button
          onClick={() => setShowEdit(true)}
          className="p-2 rounded-xl bg-bg-card border border-bg-border text-slate-400 hover:text-white transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>

      <div className="px-4 space-y-4">
        {/* Player card */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/30 border border-accent/30 rounded-2xl p-5 text-center">
          <div className="text-7xl mb-3">{player.avatar}</div>
          <h2 className="text-white font-black text-2xl mb-1">{player.name}</h2>
          <p className="text-slate-400 mb-3">{player.city}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold">
              ⭐ Level {player.level} — {player.title}
            </span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-xp font-bold">{player.xp} XP</span>
            <span className="text-slate-400">{player.xpToNextLevel - player.xp} to Level {player.level + 1}</span>
          </div>
          <div className="h-3 bg-bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full progress-bar"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Lv. {player.level}</span>
            <span>Lv. {player.level + 1}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-card border border-bg-border rounded-2xl p-3 text-center">
            <div className="text-white font-black text-2xl">{player.totalSessions}</div>
            <div className="text-slate-400 text-xs">Sessions</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-2xl p-3 text-center">
            <div className="text-amber-400 font-black text-2xl">
              {player.streak > 0 ? `🔥${player.streak}` : '—'}
            </div>
            <div className="text-slate-400 text-xs">Day streak</div>
          </div>
          <div className="bg-bg-card border border-bg-border rounded-2xl p-3 text-center">
            <div className="text-white font-black text-2xl">{uniqueSportsPlayed}</div>
            <div className="text-slate-400 text-xs">Sports played</div>
          </div>
        </div>

        {/* Sports activity */}
        {sportsSorted.length > 0 && (
          <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
            <h3 className="text-white font-bold mb-4">Activity by sport</h3>
            <div className="space-y-3">
              {sportsSorted.map(({ sport, count }) => {
                const cfg = SPORT_CONFIG[sport];
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={sport}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{cfg.icon}</span>
                        <span className="text-slate-300 text-sm">{cfg.label}</span>
                      </div>
                      <span className="text-slate-400 text-sm font-semibold">{count} sessions</span>
                    </div>
                    <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-bg-card border border-bg-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">Achievements</h3>
            <span className="text-slate-400 text-xs">{player.achievements.length} / {ACHIEVEMENTS.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ACHIEVEMENTS.map(ach => {
              const unlocked = player.achievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  title={`${ach.name}: ${ach.description}`}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    unlocked
                      ? 'border-accent/40 bg-accent/10'
                      : 'border-bg-border bg-bg-primary opacity-40'
                  }`}
                >
                  <span className={`text-2xl ${!unlocked ? 'grayscale' : ''}`}>{ach.icon}</span>
                  <span className="text-xs text-center leading-tight text-slate-400 line-clamp-2">
                    {ach.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join date */}
        <p className="text-center text-slate-600 text-xs pb-4">
          Member since {new Date(player.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {showEdit && <EditModal onClose={() => setShowEdit(false)} />}
    </div>
  );
}
