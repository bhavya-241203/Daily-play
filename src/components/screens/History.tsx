import { useGameStore } from '../../store/gameStore';
import { Zap } from 'lucide-react';
import { MatchSession, Sport } from '../../types';

const SPORT_CONFIG: Record<Sport, { icon: string; label: string; color: string }> = {
  cricket: { icon: '🏏', label: 'Cricket', color: 'text-sport-cricket' },
  badminton: { icon: '🏸', label: 'Badminton', color: 'text-sport-badminton' },
  pickleball: { icon: '🏓', label: 'Pickleball', color: 'text-sport-pickleball' },
};

const RESULT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  win: { bg: 'bg-win/20 border-win/30', text: 'text-win', label: 'W' },
  loss: { bg: 'bg-loss/20 border-loss/30', text: 'text-loss', label: 'L' },
  draw: { bg: 'bg-draw/20 border-draw/30', text: 'text-draw', label: 'D' },
  'no-result': { bg: 'bg-slate-500/20 border-slate-500/30', text: 'text-slate-400', label: 'NR' },
};

function groupByDate(sessions: MatchSession[]): Record<string, MatchSession[]> {
  const groups: Record<string, MatchSession[]> = {};
  for (const s of sessions) {
    const date = s.date.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(s);
  }
  return groups;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function History() {
  const sessions = useGameStore(s => s.sessions);

  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const grouped = groupByDate(sorted);
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thisMonthSessions = sessions.filter(s => s.date >= monthStart);
  const thisMonthXp = thisMonthSessions.reduce((sum, s) => sum + s.xpEarned, 0);
  const totalXp = sessions.reduce((sum, s) => sum + s.xpEarned, 0);

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-white">Match History</h1>
        <p className="text-slate-400 text-sm">All your matches</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-card border border-bg-border rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={14} className="text-xp" />
            <span className="text-xs text-slate-400">This Month</span>
          </div>
          <div className="text-2xl font-black text-xp">+{thisMonthXp}</div>
          <div className="text-xs text-slate-500 mt-0.5">{thisMonthSessions.length} matches</div>
        </div>
        <div className="bg-bg-card border border-bg-border rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">🏆</span>
            <span className="text-xs text-slate-400">All Time</span>
          </div>
          <div className="text-2xl font-black text-white">+{totalXp}</div>
          <div className="text-xs text-slate-500 mt-0.5">{sessions.length} total matches</div>
        </div>
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-6xl">📭</div>
          <p className="text-slate-400 font-medium">No matches yet</p>
          <p className="text-slate-600 text-sm">Play your first match to see history here!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {dateKeys.map(date => {
            const daySessions = grouped[date];
            const dayXp = daySessions.reduce((sum, s) => sum + s.xpEarned, 0);
            return (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-sm font-bold text-slate-300">{formatDate(date)}</span>
                  <span className="text-xs text-xp font-semibold">+{dayXp} XP</span>
                </div>

                {/* Sessions */}
                <div className="space-y-2">
                  {daySessions.map(session => {
                    const sc = SPORT_CONFIG[session.sport];
                    const rs = RESULT_STYLES[session.result];
                    const time = new Date(session.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div
                        key={session.id}
                        className="bg-bg-card border border-bg-border rounded-xl p-4 flex items-start gap-3"
                      >
                        <span className="text-2xl mt-0.5">{sc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm">{sc.label}</span>
                            <span className="text-xs text-slate-500">{session.format}</span>
                            {session.venue && (
                              <>
                                <span className="text-slate-700">·</span>
                                <span className="text-xs text-slate-500 truncate">{session.venue}</span>
                              </>
                            )}
                          </div>
                          {session.score && (
                            <p className="text-xs text-slate-400 mt-1 truncate">{session.score}</p>
                          )}
                          {session.notes && (
                            <p className="text-xs text-slate-500 mt-1 italic truncate">"{session.notes}"</p>
                          )}
                          {session.achievements.length > 0 && (
                            <div className="flex gap-1 mt-1.5">
                              {session.achievements.slice(0, 3).map(id => (
                                <span key={id} className="text-xs bg-xp/10 text-xp border border-xp/20 px-1.5 py-0.5 rounded-full">
                                  🏅 Badge
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-slate-600 mt-1">{time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full border font-black ${rs.bg} ${rs.text}`}>
                            {rs.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <Zap size={11} className="text-xp" />
                            <span className="text-xp text-xs font-bold">{session.xpEarned}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
