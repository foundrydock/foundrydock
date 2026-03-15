import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import { Menu } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-900">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-neutral-950 border-b border-neutral-800 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-white text-sm font-semibold">Mittamuoto</span>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
