import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Presentation, Users, Link2, LogOut,
  FileText, CalendarDays, Palette, Building2, ChevronDown, Check, Plus, Files, X
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/library', label: 'Materiaalipankki', icon: FolderOpen },
  { to: '/pitchdecks', label: 'Pitchdeckit', icon: Presentation },
  { to: '/documents', label: 'Dokumentit', icon: FileText },
  { to: '/board', label: 'Hall. kokoukset', icon: CalendarDays },
  { to: '/brand', label: 'Brand Guidelines', icon: Palette },
  { to: '/share-links', label: 'Jakolinkit', icon: Link2 },
];

const adminNav = [
  { to: '/admin', label: 'Käyttäjät', icon: Users },
  { to: '/companies', label: 'Yritykset', icon: Building2 },
];

export default function AppSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, signOut } = useAuth();
  const { companies, activeCompany, setActiveCompanyId } = useCompany();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={cn(
      "w-56 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0",
      "fixed inset-y-0 left-0 z-40 transition-transform duration-200",
      "md:relative md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <button
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 p-1 rounded text-neutral-500 hover:text-white"
      >
        <X size={18} />
      </button>
      {/* Company switcher */}
      <div className="px-3 py-4 border-b border-neutral-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-900 transition-colors group">
              <div className="w-7 h-7 rounded bg-white shrink-0 flex items-center justify-center">
                <span className="text-black text-xs font-bold">
                  {activeCompany?.name?.charAt(0) ?? 'M'}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-white text-xs font-semibold leading-tight truncate">
                  {activeCompany?.name ?? 'Valitse yritys'}
                </div>
                <div className="text-neutral-500 text-xs">Datapankki</div>
              </div>
              <ChevronDown size={14} className="text-neutral-600 group-hover:text-neutral-400 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-900 border-neutral-700 text-white w-52" align="start">
            {companies.map(c => (
              <DropdownMenuItem
                key={c.id}
                className="gap-2 hover:bg-neutral-800 cursor-pointer"
                onClick={() => setActiveCompanyId(c.id)}
              >
                <div className="w-5 h-5 rounded bg-white shrink-0 flex items-center justify-center">
                  <span className="text-black text-xs font-bold">{c.name.charAt(0)}</span>
                </div>
                <span className="flex-1 truncate text-sm">{c.name}</span>
                {c.id === activeCompany?.id && <Check size={14} className="text-white shrink-0" />}
              </DropdownMenuItem>
            ))}
            {profile?.role === 'admin' && (
              <>
                <DropdownMenuSeparator className="bg-neutral-700" />
                <DropdownMenuItem
                  className="gap-2 hover:bg-neutral-800 cursor-pointer text-neutral-400"
                  onClick={() => { navigate('/companies'); onClose(); }}
                >
                  <Plus size={14} />
                  <span className="text-sm">Uusi yritys</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                active ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              )}
            >
              <item.icon size={15} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-neutral-600 text-xs uppercase tracking-wider font-medium">Hallinta</span>
            </div>
            {adminNav.map(item => {
              const active = location.pathname.startsWith(item.to);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    active ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  )}
                >
                  <item.icon size={15} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-neutral-800 space-y-0.5">
        <div className="px-3 py-1.5">
          <div className="text-white text-xs font-medium truncate">{profile?.full_name || profile?.email}</div>
          <div className="text-neutral-500 text-xs capitalize">{profile?.role}</div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <LogOut size={15} />
          Kirjaudu ulos
        </button>
      </div>
    </aside>
  );
}
