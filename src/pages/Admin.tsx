import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserPlus, Shield, User, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

type Profile = Tables<'profiles'>;
type Folder = Tables<'asset_folders'>;

export default function Admin() {
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at');
      return (data ?? []) as Profile[];
    },
  });

  const { data: folders } = useQuery({
    queryKey: ['asset-folders'],
    queryFn: async () => {
      const { data } = await supabase.from('asset_folders').select('*').order('sort_order');
      return (data ?? []) as Folder[];
    },
  });

  async function changeRole(userId: string, newRole: 'admin' | 'viewer') {
    if (userId === currentUser?.id) { toast.error('Et voi muuttaa omaa rooliasi'); return; }
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    qc.invalidateQueries({ queryKey: ['admin-users'] });
    toast.success('Rooli päivitetty');
  }

  async function changeFolderAccess(folderId: string, access: 'public' | 'link' | 'private') {
    await supabase.from('asset_folders').update({ access_level: access }).eq('id', folderId);
    qc.invalidateQueries({ queryKey: ['asset-folders'] });
    toast.success('Kansion näkyvyys päivitetty');
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hallinta</h1>
          <p className="text-neutral-500 text-sm mt-1">Käyttäjät ja oikeudet</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
          <UserPlus size={16} />
          Kutsu käyttäjä
        </Button>
      </div>

      {/* Users */}
      <div className="mb-10">
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users size={14} />
          Käyttäjät
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-neutral-800/30 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
            {users?.map((u, i) => (
              <div key={u.id} className={`flex items-center gap-4 px-5 py-4 ${i < users.length - 1 ? 'border-b border-neutral-800' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-medium">
                    {(u.full_name || u.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{u.full_name || '—'}</div>
                  <div className="text-neutral-500 text-xs">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeRole(u.id, u.role === 'admin' ? 'viewer' : 'admin')}
                    disabled={u.id === currentUser?.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      u.role === 'admin'
                        ? 'bg-purple-950/50 text-purple-400 hover:bg-purple-950 border border-purple-800/50'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white border border-neutral-700'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                    {u.role === 'admin' ? 'Admin' : 'Viewer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-neutral-600 text-xs mt-3">Klikkaa roolia vaihtaaksesi admin ↔ viewer</p>
      </div>

      {/* Folder access */}
      <div>
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FolderOpen size={14} />
          Kansioiden näkyvyys
        </h2>
        <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
          {folders?.map((folder, i) => (
            <div key={folder.id} className={`flex items-center gap-4 px-5 py-4 ${i < (folders?.length ?? 0) - 1 ? 'border-b border-neutral-800' : ''}`}>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{folder.name}</div>
                {folder.description && <div className="text-neutral-500 text-xs">{folder.description}</div>}
              </div>
              <div className="flex items-center gap-1.5">
                {(['public', 'link', 'private'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => changeFolderAccess(folder.id, level)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      folder.access_level === level
                        ? level === 'public' ? 'bg-green-950/50 text-green-400 border border-green-800/50'
                          : level === 'link' ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-800/50'
                          : 'bg-neutral-700 text-white border border-neutral-600'
                        : 'bg-neutral-800/50 text-neutral-500 hover:text-neutral-300 border border-transparent'
                    }`}
                  >
                    {level === 'public' ? 'Julkinen' : level === 'link' ? 'Linkillä' : 'Yksityinen'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <InviteDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}

function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleInvite() {
    if (!email || !password) return;
    setSaving(true);
    try {
      // Create user via Supabase Admin (requires service role - instead create via signUp)
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (error) throw error;

      // Profile is auto-created by trigger, but we can update role
      if (data.user && role === 'admin') {
        await supabase.from('profiles').update({ role: 'admin', full_name: name }).eq('id', data.user.id);
      } else if (data.user && name) {
        await supabase.from('profiles').update({ full_name: name }).eq('id', data.user.id);
      }

      toast.success(`Käyttäjä ${email} luotu`);
      setEmail(''); setName(''); setPassword(''); setRole('viewer');
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Käyttäjän luominen epäonnistui');
    }
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus size={18} />
            Kutsu käyttäjä
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Nimi</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Etunimi Sukunimi" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Sähköposti</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kayttaja@esimerkki.fi" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Salasana</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Väliaikainen salasana" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Rooli</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['viewer', 'admin'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    role === r ? 'border-white bg-white/10 text-white' : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {r === 'admin' ? <Shield size={14} /> : <User size={14} />}
                  {r === 'admin' ? 'Admin' : 'Viewer'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={handleInvite} disabled={saving || !email || !password} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Luodaan...' : 'Luo käyttäjä'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
