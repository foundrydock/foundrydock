import { useEffect, useState, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';

const POLL_INTERVAL = 2 * 60 * 1000; // 2 minuuttia

async function fetchPageHash(): Promise<string | null> {
  try {
    const res = await fetch('/', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    const html = await res.text();
    // Poimitaan main JS-tiedoston nimi joka muuttuu joka deployssa
    const match = html.match(/src="\/assets\/index-([^"]+)\.js"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function UpdatePrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const initialHash = useRef<string | null>(null);

  useEffect(() => {
    // Tallennetaan nykyinen versio muistiin
    fetchPageHash().then(hash => {
      initialHash.current = hash;
    });

    // Pollataan säännöllisesti
    const interval = setInterval(async () => {
      const current = await fetchPageHash();
      if (
        current &&
        initialHash.current &&
        current !== initialHash.current
      ) {
        setShowBanner(true);
      }
    }, POLL_INTERVAL);

    // Tarkistetaan myös kun käyttäjä palaa välilehdelle
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchPageHash().then(current => {
          if (current && initialHash.current && current !== initialHash.current) {
            setShowBanner(true);
          }
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 bg-white text-black px-5 py-3.5 rounded-xl shadow-2xl border border-neutral-200 max-w-sm">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">Päivitys saatavilla</div>
          <div className="text-neutral-600 text-xs mt-0.5">Uusi versio on valmis.</div>
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
          title="Sulje"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
