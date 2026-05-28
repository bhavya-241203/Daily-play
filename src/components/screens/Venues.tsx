import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Phone, Clock } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { Venue, Sport } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: '#22c55e' },
  badminton: { icon: '🏸', label: 'Badminton', color: '#f59e0b' },
  pickleball: { icon: '🥒', label: 'Pickleball', color: '#06b6d4' },
  football: { icon: '⚽', label: 'Football', color: '#f97316' },
  gym: { icon: '💪', label: 'Gym', color: '#a855f7' },
  ps5: { icon: '🎮', label: 'PS5', color: '#3b82f6' },
};

const CITIES = ['All', 'Bangalore', 'Mumbai', 'Pune', 'Hyderabad', 'Delhi'];

const PARTNER_BENEFITS = [
  '✅ Verified & quality-checked',
  '✅ Easy QR check-in',
  '✅ XP bonus for check-ins',
  '✅ Session coordination support',
  '✅ Community priority booking',
];

function VenueSheet({ venue, onClose, onCreateSession }: {
  venue: Venue;
  onClose: () => void;
  onCreateSession: () => void;
}) {
  const waMessage = encodeURIComponent(
    `Hi! I found ${venue.name} on Daily Play and I'd like to book a court. Can you help?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-auto bg-bg-card border border-bg-border rounded-t-3xl overflow-hidden" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        {/* Header */}
        <div
          className="relative p-6 pb-4"
          style={{ background: `linear-gradient(135deg, ${venue.sports[0] ? SPORT_CONFIG[venue.sports[0]].color + '30' : '#1e2540'}, #141828)` }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              {venue.image}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-white font-bold text-lg">{venue.name}</h2>
                {venue.isPartner && (
                  <span className="text-xs bg-green-500/30 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Partner
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <MapPin size={12} />
                <span>{venue.area}, {venue.city}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-bg-primary rounded-xl p-3 text-center">
              <div className="text-yellow-400 font-bold">⭐ {venue.rating}</div>
              <div className="text-slate-500 text-xs">Rating</div>
            </div>
            <div className="bg-bg-primary rounded-xl p-3 text-center">
              <div className="text-white font-bold">₹{venue.pricePerHour}</div>
              <div className="text-slate-500 text-xs">per hour</div>
            </div>
            <div className="bg-bg-primary rounded-xl p-3 text-center">
              <div className="text-white font-bold text-sm">{venue.openTime}–{venue.closeTime}</div>
              <div className="text-slate-500 text-xs">Hours</div>
            </div>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Sports available</h3>
            <div className="flex flex-wrap gap-2">
              {venue.sports.map(sport => (
                <span
                  key={sport}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${SPORT_CONFIG[sport].color}20`, color: SPORT_CONFIG[sport].color }}
                >
                  {SPORT_CONFIG[sport].icon} {SPORT_CONFIG[sport].label}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2 bg-bg-primary rounded-xl p-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300">{venue.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-slate-500 flex-shrink-0" />
              <span className="text-slate-300">{venue.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-slate-500 flex-shrink-0" />
              <span className="text-slate-300">Open {venue.openTime} – {venue.closeTime}</span>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-bg-primary rounded-xl h-28 flex items-center justify-center border border-bg-border">
            <div className="text-center">
              <div className="text-2xl mb-1">📍</div>
              <p className="text-slate-500 text-xs">{venue.address}</p>
            </div>
          </div>

          {/* Partner benefits */}
          {venue.isPartner && (
            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400 font-bold text-sm">🏅 Official Daily Play Partner</span>
              </div>
              <div className="space-y-1.5">
                {PARTNER_BENEFITS.map((b, i) => (
                  <p key={i} className="text-green-400/80 text-xs">{b}</p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <a
            href={`https://wa.me/${venue.phone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b85a] text-white font-bold py-3.5 rounded-xl transition-all"
          >
            📱 Book via WhatsApp
          </a>
          <button
            onClick={onCreateSession}
            className="w-full bg-accent hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95"
          >
            Create Session Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Venues() {
  const navigate = useNavigate();
  const venues = useGameStore(s => s.venues);
  const player = useGameStore(s => s.player);

  const [cityFilter, setCityFilter] = useState(player?.city ?? 'All');
  const [sportFilter, setSportFilter] = useState<Sport | 'all'>('all');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const filtered = venues.filter(v => {
    if (cityFilter !== 'All' && v.city !== cityFilter) return false;
    if (sportFilter !== 'all' && !v.sports.includes(sportFilter)) return false;
    return true;
  });

  const sportFilters: { value: Sport | 'all'; label: string; icon?: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'cricket', label: 'Cricket', icon: '🏏' },
    { value: 'badminton', label: 'Badminton', icon: '🏸' },
    { value: 'pickleball', label: 'Pickleball', icon: '🥒' },
    { value: 'football', label: 'Football', icon: '⚽' },
    { value: 'gym', label: 'Gym', icon: '💪' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-4 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-white font-black text-2xl mb-4">Venues</h1>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                cityFilter === c
                  ? 'bg-accent text-white'
                  : 'bg-bg-card border border-bg-border text-slate-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sport filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {sportFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setSportFilter(f.value)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sportFilter === f.value
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-bg-card border border-bg-border text-slate-500'
              }`}
            >
              {f.icon && <span>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-3">🏟️</div>
            <p className="text-slate-400">No venues found for your filters</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            {filtered.map(venue => {
              const primarySport = venue.sports[0];
              const accentColor = primarySport ? SPORT_CONFIG[primarySport].color : '#6366f1';

              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden cursor-pointer card-hover"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                        style={{ backgroundColor: `${accentColor}20` }}
                      >
                        {venue.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-white font-bold">{venue.name}</span>
                          {venue.isPartner && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                              Partner
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <MapPin size={11} />
                          <span>{venue.area}, {venue.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sports */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {venue.sports.map(sport => (
                        <span
                          key={sport}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${SPORT_CONFIG[sport].color}20`, color: SPORT_CONFIG[sport].color }}
                        >
                          {SPORT_CONFIG[sport].icon} {SPORT_CONFIG[sport].label}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-semibold text-white">₹{venue.pricePerHour}/hr</span>
                      <span>⭐ {venue.rating}</span>
                      <span>{venue.openTime}–{venue.closeTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedVenue && (
        <VenueSheet
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onCreateSession={() => {
            navigate(`/create?venue=${encodeURIComponent(selectedVenue.name)}&venueId=${selectedVenue.id}`);
            setSelectedVenue(null);
          }}
        />
      )}
    </div>
  );
}
