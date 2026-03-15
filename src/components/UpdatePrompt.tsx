import { useEffect, useState, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';

const POLL_INTERVAL = 30 * 1000;

/**
 * Hakee nykyisen JS-bundlen tunnisteen DOM:sta (ei fetchaa mitään).
 */
function getCurrentVersionFromDOM(): string | null {
  // Etsitään <script> tag jossa on Vite-generoitu hash
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    const src = s.getAttribute('src') || '';
    const m = src.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    if (m?.[1]) return m[1];
  }
  // Fallback: mikä tahansa moduuli-skripti
  for (const s of scripts) {
    const src = s.getAttribute('src') || '';
    if (src.includes('.js')) return src;
  }
  return null;
}

/**
 * Hakee uusimman version palvelimelta.
 */
async function fetchLatestVersion(): Promise<string | null> {
  try {
    // Haetaan index.html cache-buusterilla
    const res = await fetch(`${window.location.origin}/index.html?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (!res.ok) return null;

    const html = await res.text();

    // Etsitään JS-bundlen hash
    const m = html.match(/\/assets\/index-([A-Za-z0-9_-]+)\.js/);
    if (m?.[1]) return m[1];

    // Fallback: mikä tahansa .js src
    const m2 = html.match(/src="([^"]*\.js[^"]*)"/);
    if (m2?.[1]) return m2[1];

    // ETag
    const etag = res.headers.get('etag');
    if (etag) return etag;

    return null;
  } catch {
    return null;
  }
}

export default function UpdatePrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const baselineVersion = useRef<string | null>(null);
  const checking = useRef(false);

  useEffect(() => {
    // Tallennetaan baseline DOM:sta heti mountissa
    baselineVersion.current = getCurrentVersionFromDOM();
    console.debug('[UpdatePrompt] Baseline:', baselineVersion.current?.slice(0, 40));

    async function check() {
      if (checking.current || !baselineVersion.current) return;
      checking.current = true;
      try {
        const latest = await fetchLatestVersion();
        if (!latest) return;
        if (latest !== baselineVersion.current) {
          console.debug('[UpdatePrompt] Uusi versio:', latest.slice(0, 40), '(oli:', baselineVersion.current?.slice(0, 40), ')');
          setShowBanner(true);
        }
      } finally {
        checking.current = false;
      }
    }

    // Ensimmäinen tarkistus pienen viiveen jälkeen
    const timeout = setTimeout(check, 5000);

    // Pollaus
    const interval = setInterval(check, POLL_INTERVAL);

    // Kun käyttäjä palaa välilehdelle
    const onVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Kun verkko palaa
    window.addEventListener('online', check);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', check);
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
