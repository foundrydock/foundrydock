import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Presentation, Users, Link2, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/library', label: 'Materiaalipankki', icon: FolderOpen },
  { to: '/pitchdecks', label: 'Pitchdeckit', icon: Presentation },
  { to: '/share-links', label: 'Jakolinkit', icon: Link2 },
  { to: '/admin', label: 'Hallinta', icon: Users, adminOnly: true },
];

export default function AppSidebar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-56 min-h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-sm bg-white shrink-0" />
          <div>
            <div className="text-white text-sm font-semibold leading-tight">Mittamuoto</div>
            <div className="text-neutral-500 text-xs">Datapankki</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {nav.map(item => {
          if (item.adminOnly && profile?.role !== 'admin') return null;
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-2 py-4 border-t border-neutral-800 space-y-0.5">
        <div className="px-3 py-2">
          <div className="text-white text-xs font-medium truncate">{profile?.full_name || profile?.email}</div>
          <div className="text-neutral-500 text-xs capitalize">{profile?.role}</div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <LogOut size={16} />
          Kirjaudu ulos
        </button>
      </div>
    </aside>
  );
}
