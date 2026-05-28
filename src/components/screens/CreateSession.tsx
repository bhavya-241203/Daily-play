import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, MapPin, Minus, Plus } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Sport, SkillLevel } from '../../types';

const SPORT_OPTIONS: { value: Sport; label: string; icon: string; color: string }[] = [
  { value: 'cricket', label: 'Cricket', icon: '🏏', color: '#22c55e' },
  { value: 'badminton', label: 'Badminton', icon: '🏸', color: '#f59e0b' },
  { value: 'pickleball', label: 'Pickleball', icon: '🥒', color: '#06b6d4' },
  { value: 'football', label: 'Football', icon: '⚽', color: '#f97316' },
  { value: 'gym', label: 'Gym', icon: '💪', color: '#a855f7' },
  { value: 'ps5', label: 'PS5', icon: '🎮', color: '#3b82f6' },
];

const SKILL_OPTIONS: { value: SkillLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: "New to the sport" },
  { value: 'intermediate', label: 'Intermediate', desc: "Played regularly" },
  { value: 'advanced', label: 'Advanced', desc: "Competitive level" },
  { value: 'open', label: 'Open to all', desc: "Everyone welcome" },
];

const MAX_PLAYERS_OPTIONS = [4, 6, 8, 10, 12];

const TIMES: string[] = [];
for (let h = 5; h <= 22; h++) {
  TIMES.push(`${String(h).padStart(2, '0')}:00`);
  TIMES.push(`${String(h).padStart(2, '0')}:30`);
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getNext7Days(): { label: string; short: string; iso: string }[] {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' });
    const short = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    days.push({ label, short, iso });
  }
  return days;
}

export default function CreateSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const player = useGameStore(s => s.player);
  const venues = useGameStore(s => s.venues);
  const createSession = useGameStore(s => s.createSession);

  const prefilledVenue = searchParams.get('venue') ?? '';
  const prefilledVenueId = searchParams.get('venueId') ?? '';

  const [sport, setSport] = useState<Sport | null>(null);
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].iso);
  const [time, setTime] = useState('07:00');
  const [venueMode, setVenueMode] = useState<'partner' | 'manual'>(prefilledVenue ? 'manual' : 'partner');
  const [venue, setVenue] = useState(prefilledVenue);
  const [venueId, setVenueId] = useState(prefilledVenueId);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('open');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const days = getNext7Days();
  const partnerVenues = venues.filter(v => !sport || v.sports.includes(sport));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!sport) e.sport = 'Select a sport';
    if (!title.trim()) e.title = 'Enter a session title';
    if (!venue.trim()) e.venue = 'Select or enter a venue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !player || !sport) return;
    const id = createSession({
      sport,
      title: title.trim(),
      date: selectedDate,
      time,
      venue: venue.trim(),
      venueId: venueId || undefined,
      city: player.city,
      maxPlayers,
      hostId: player.id,
      hostName: player.name,
      hostAvatar: player.avatar,
      skillLevel,
      notes: notes.trim(),
    });
    navigate(`/session/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-bg-card border border-bg-border text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-white font-black text-xl">Create Session</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Sport selector */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-3">
            Sport {errors.sport && <span className="text-red-400 ml-2">{errors.sport}</span>}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SPORT_OPTIONS.map(s => (
              <button
                key={s.value}
                onClick={() => { setSport(s.value); setErrors(e => ({ ...e, sport: '' })); }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 active:scale-95 ${
                  sport === s.value
                    ? 'border-accent bg-accent/10'
                    : 'border-bg-border bg-bg-card hover:border-slate-500'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className={`text-xs font-semibold ${sport === s.value ? 'text-white' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Session title {errors.title && <span className="text-red-400 ml-2">{errors.title}</span>}
          </label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(er => ({ ...er, title: '' })); }}
            placeholder={sport ? `e.g. Sunday morning ${sport}` : 'e.g. Sunday morning cricket'}
            className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Date picker */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-3">Date</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {days.map(day => (
              <button
                key={day.iso}
                onClick={() => setSelectedDate(day.iso)}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border transition-all duration-150 ${
                  selectedDate === day.iso
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-bg-border bg-bg-card text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-semibold">{day.label}</span>
                <span className="text-xs opacity-70">{day.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time picker */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Time</label>
          <div className="relative">
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer pr-10"
            >
              {TIMES.map(t => (
                <option key={t} value={t} className="bg-bg-card">{formatTime(t)}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">
            Venue {errors.venue && <span className="text-red-400 ml-2">{errors.venue}</span>}
          </label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setVenueMode('partner')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                venueMode === 'partner' ? 'bg-accent text-white' : 'bg-bg-card border border-bg-border text-slate-400'
              }`}
            >
              Partner Venues
            </button>
            <button
              onClick={() => setVenueMode('manual')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                venueMode === 'manual' ? 'bg-accent text-white' : 'bg-bg-card border border-bg-border text-slate-400'
              }`}
            >
              Enter Manually
            </button>
          </div>

          {venueMode === 'partner' ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {partnerVenues.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No partner venues for this sport</p>
              ) : (
                partnerVenues.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setVenue(v.name); setVenueId(v.id); setErrors(e => ({ ...e, venue: '' })); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      venueId === v.id
                        ? 'border-accent bg-accent/10'
                        : 'border-bg-border bg-bg-card hover:border-slate-500'
                    }`}
                  >
                    <span className="text-2xl">{v.image}</span>
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">{v.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">{v.area}</span>
                        {v.isPartner && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                            Partner
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 text-xs">₹{v.pricePerHour}/hr</div>
                      <div className="text-yellow-400 text-xs">⭐ {v.rating}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={venue}
                onChange={e => { setVenue(e.target.value); setVenueId(''); setErrors(er => ({ ...er, venue: '' })); }}
                placeholder="Enter venue name or address"
                className="w-full bg-bg-card border border-bg-border rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          )}
        </div>

        {/* Max Players */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-3">Max Players</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMaxPlayers(p => {
                const idx = MAX_PLAYERS_OPTIONS.indexOf(p);
                return idx > 0 ? MAX_PLAYERS_OPTIONS[idx - 1] : p;
              })}
              className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border text-white flex items-center justify-center hover:border-accent transition-colors"
            >
              <Minus size={16} />
            </button>
            <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
              {MAX_PLAYERS_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => setMaxPlayers(n)}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    maxPlayers === n
                      ? 'bg-accent text-white'
                      : 'bg-bg-card border border-bg-border text-slate-400 hover:border-accent/50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMaxPlayers(p => {
                const idx = MAX_PLAYERS_OPTIONS.indexOf(p);
                return idx < MAX_PLAYERS_OPTIONS.length - 1 ? MAX_PLAYERS_OPTIONS[idx + 1] : p;
              })}
              className="w-10 h-10 rounded-xl bg-bg-card border border-bg-border text-white flex items-center justify-center hover:border-accent transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-3">Skill Level</label>
          <div className="grid grid-cols-2 gap-2">
            {SKILL_OPTIONS.map(sl => (
              <button
                key={sl.value}
                onClick={() => setSkillLevel(sl.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all duration-150 ${
                  skillLevel === sl.value
                    ? 'border-accent bg-accent/10'
                    : 'border-bg-border bg-bg-card hover:border-slate-500'
                }`}
              >
                <div className={`text-sm font-bold ${skillLevel === sl.value ? 'text-white' : 'text-slate-300'}`}>
                  {sl.label}
                </div>
                <div className="text-xs text-slate-500">{sl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any special instructions, what to bring, dress code..."
            rows={3}
            className="w-full bg-bg-card border border-bg-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Create button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 active:scale-95 glow-accent"
        >
          Create Session 🎯
        </button>
      </div>
    </div>
  );
}
