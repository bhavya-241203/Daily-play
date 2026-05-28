import { NavLink } from 'react-router-dom';
import { Home, Play, Trophy, Star, Clock } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/play', icon: Play, label: 'Play' },
  { to: '/career', icon: Trophy, label: 'Career' },
  { to: '/achievements', icon: Star, label: 'Badges' },
  { to: '/history', icon: Clock, label: 'History' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-bg-border">
      <div className="max-w-lg mx-auto flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200 ${
                isActive
                  ? 'text-accent'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-accent/20' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
