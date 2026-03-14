import { useEffect, useState, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';

// Kuinka usein tarkistetaan (ms)
const POLL_INTERVAL = 30 * 1000; // 30 sekuntia

async function getDeployVersion(): Promise<string | null> {
  try {
    const url = `${window.location.origin}/?_cb=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' },
    });

    // 1. Parsitaan JS-tiedoston hash HTML:stä (luotettavin tapa)
    const html = await res.text();
    const patterns = [
      /\/assets\/index-([A-Za-z0-9_-]+)\.js/,
      /src="[^"]*\/index-([A-Za-z0-9_-]+)\.js"/,
      /src="([^"]*\.js)"/,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1]) return m[1];
    }

    // 2. ETag tai Last-Modified headerista
    const etag = res.headers.get('etag');
    if (etag) return etag;
    const lastMod = res.headers.get('last-modified');
    if (lastMod) return lastMod;

    // 3. Viimeinen fallback: HTML-sisällön hash
    return `len-${html.length}`;
  } catch {
    return null;
  }
}

export default function UpdatePrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const initialVersion = useRef<string | null>(null);
  const checking = useRef(false);

  async function checkForUpdate() {
    if (checking.current) return;
    checking.current = true;
    try {
      const current = await getDeployVersion();
      if (!current) return;

      if (!initialVersion.current) {
        // Ensimmäinen tarkistus — tallennetaan versio
        initialVersion.current = current;
        console.debug('[UpdatePrompt] Versio tallennettu:', current.slice(0, 30));
        return;
      }

      if (current !== initialVersion.current) {
        console.debug('[UpdatePrompt] Uusi versio havaittu:', current.slice(0, 30));
        setShowBanner(true);
      }
    } finally {
      checking.current = false;
    }
  }

  useEffect(() => {
    // Tarkistetaan heti käynnistyessä
    checkForUpdate();

    // Pollaus
    const interval = setInterval(checkForUpdate, POLL_INTERVAL);

    // Kun käyttäjä palaa välilehdelle
    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkForUpdate();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Kun verkko palaa
    const onOnline = () => checkForUpdate();
    window.addEventListener('online', onOnline);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-white text-black px-5 py-3.5 rounded-xl shadow-2xl border border-neutral-200 max-w-sm">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">Päivitys saatavilla</div>
          <div className="text-neutral-600 text-xs mt-0.5">Uusi versio on valmis ladattavaksi.</div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
        >
          <RefreshCw size={12} />
          Päivitä
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 text-neutral-400 hover:text-black rounded transition-colors shrink-0"
          title="Myöhemmin"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
