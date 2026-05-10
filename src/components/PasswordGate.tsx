import React, { useState } from 'react';

export type AccessRole = 'editor' | 'viewer';

const PASSWORDS: Record<string, AccessRole> = {
  'editor': 'editor',
  'viewer': 'viewer',
};

interface PasswordGateProps {
  children: React.ReactNode;
}

export function getAccessRole(): AccessRole | null {
  const role = sessionStorage.getItem('deck_access_role');
  if (role === 'editor' || role === 'viewer') return role;
  return null;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [authenticated, setAuthenticated] = useState(() => {
    return getAccessRole() !== null;
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = PASSWORDS[password];
    if (role) {
      sessionStorage.setItem('deck_authenticated', 'true');
      sessionStorage.setItem('deck_access_role', role);
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
            <h1 className="text-white text-lg font-semibold">Protected content</h1>
            <p className="text-slate-400 text-sm mt-1">Enter password to continue</p>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Password"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mb-3">Incorrect password. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Open
          </button>
        </form>
      </div>
    </div>
  );
}
