import React, { useState } from 'react';

const SITE_PASSWORD = 'mittamuoto2024';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('deck_authenticated') === 'true';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem('deck_authenticated', 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 className="text-white text-lg font-semibold">Suojattu sisältö</h1>
            <p className="text-slate-400 text-sm mt-1">Syötä salasana jatkaaksesi</p>
          </div>
          
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Salasana"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            autoFocus
          />
          
          {error && (
            <p className="text-red-400 text-sm mb-3">Väärä salasana. Yritä uudelleen.</p>
          )}
          
          <button
            type="submit"
            className="w-full py-3 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Avaa esitys
          </button>
        </form>
      </div>
    </div>
  );
}
