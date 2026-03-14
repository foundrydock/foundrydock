import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const { session, loading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) setError('Väärä sähköposti tai salasana.');
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-sm bg-white" />
            <span className="text-white text-xl font-semibold tracking-tight">Mittamuoto</span>
          </div>
          <p className="text-neutral-500 text-sm mt-1">Datapankki</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-neutral-300 text-sm">Sähköposti</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
              placeholder="sinä@measureshape.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-neutral-300 text-sm">Salasana</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-neutral-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black hover:bg-neutral-100 font-medium"
          >
            {submitting ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
          </Button>
        </form>
      </div>
    </div>
  );
}
