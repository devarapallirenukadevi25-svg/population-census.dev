import { NavLink, useLocation } from 'react-router-dom';
import { Globe2, BarChart2, GitCompare, BrainCircuit, Clock, Settings } from 'lucide-react';

const navItems = [
  { path: '/globe', icon: Globe2, label: 'Globe' },
  { path: '/country/world', icon: BarChart2, label: 'Census' },
  { path: '/compare', icon: GitCompare, label: 'Compare' },
  { path: '/insights', icon: BrainCircuit, label: 'AI Insights' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActivePath = (path) => {
    const section = path.split('/')[1];
    return location.pathname.startsWith(section ? `/${section}` : path);
  };

  const renderNavItem = (item, variant) => {
    const isActive = isActivePath(item.path);
    const Icon = item.icon;
    if (variant === 'mobile') {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          aria-label={item.label}
          className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-medium transition-colors ${
            isActive ? 'text-aurora-green' : 'text-gray-400 hover:text-white'
          }`}
        >
          {isActive && (
            <div
              className="absolute inset-0 rounded-2xl border border-white/15 bg-white/10"
            />
          )}
          <Icon className="relative z-10 h-5 w-5 shrink-0" />
          <span className="relative z-10 block max-w-full truncate">{item.label}</span>
        </NavLink>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        aria-label={item.label}
        className={`relative group p-3 rounded-full transition-all duration-300 ${
          isActive ? 'bg-white/10 text-aurora-green' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {isActive && (
          <div
            className="absolute inset-0 bg-white/10 rounded-full border border-white/20 shadow-[0_0_10px_rgba(60,224,166,0.2)]"
          />
        )}
        <Icon className="w-5 h-5 relative z-10" />

        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 glass-panel rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          <span className="text-sm font-medium text-white">{item.label}</span>
        </div>
      </NavLink>
    );
  };

  return (
    <>
      <nav className="fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 md:block" aria-label="Primary navigation">
        <div className="glass-panel py-6 px-3 flex flex-col gap-6 items-center rounded-full">
        <div className="mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-green to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(60,224,166,0.5)]">
            <Globe2 className="text-white w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {navItems.map((item) => renderNavItem(item, 'desktop'))}
        </div>
        </div>
      </nav>

      <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden" aria-label="Primary navigation">
        <div className="glass-panel grid grid-cols-6 gap-1 rounded-3xl p-2">
          {navItems.map((item) => renderNavItem(item, 'mobile'))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
