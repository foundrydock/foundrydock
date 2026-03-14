import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Poll for updates every 60 seconds
      if (r) {
        setInterval(() => r.update(), 60 * 1000);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-white text-black px-5 py-3.5 rounded-xl shadow-2xl border border-neutral-200 max-w-sm">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">Päivitys saatavilla</div>
          <div className="text-neutral-600 text-xs mt-0.5">Uusi versio on ladattu taustalla.</div>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
        >
          <RefreshCw size={12} />
          Päivitä
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="p-1 text-neutral-400 hover:text-black rounded transition-colors shrink-0"
          title="Sulje"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
