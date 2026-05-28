import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, MapPin, Users, Plus } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/find', icon: Search, label: 'Find', end: false },
    null, // placeholder for FAB
    { to: '/venues', icon: MapPin, label: 'Venues', end: false },
    { to: '/community', icon: Users, label: 'Community', end: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-bg-border">
      <div className="max-w-lg mx-auto flex items-center h-16">
        {navItems.map((item, _i) => {
          if (item === null) {
            // Center FAB
            return (
              <NavLink
                key="create"
                to="/create"
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center justify-center -mt-6 transition-all duration-200 ${
                    isActive ? 'scale-95' : ''
                  }`
                }
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 ${
                    location.pathname === '/create'
                      ? 'bg-indigo-500 glow-accent'
                      : 'bg-accent hover:bg-indigo-500 glow-accent'
                  }`}
                >
                  <Plus size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-500 mt-0.5">Play</span>
              </NavLink>
            );
          }

          const { to, icon: Icon, label, end } = item;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-slate-500 hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-accent/20' : ''
                    }`}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
