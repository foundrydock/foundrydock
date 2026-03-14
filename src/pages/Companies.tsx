import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Plus, Users, Trash2, UserPlus, Shield, User, X } from 'lucide-react';
import { toast } from 'sonner';

type Company = Tables<'companies'>;
type CompanyMember = Tables<'company_members'> & { profiles: Tables<'profiles'> | null };

export default function Companies() {
  const { user } = useAuth();
  const { refetch } = useCompany();
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const { data: companies, isLoading } = useQuery({
    queryKey: ['all-companies'],
    queryFn: async () => {
      const { data } = await supabase.from('companies').select('*').order('name');
      return (data ?? []) as Company[];
    },
  });

  const { data: members } = useQuery({
    queryKey: ['company-members', selectedCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_members')
        .select('*, profiles(*)')
        .eq('company_id', selectedCompany!.id);
      return (data ?? []) as CompanyMember[];
    },
    enabled: !!selectedCompany?.id,
  });

  async function deleteCompany(id: string) {
    if (!confirm('Poistetaanko yritys? Kaikki data poistetaan.')) return;
    await supabase.from('companies').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['all-companies'] });
    refetch();
    if (selectedCompany?.id === id) setSelectedCompany(null);
    toast.success('Yritys poistettu');
  }

  async function changeMemberRole(memberId: string, role: 'admin' | 'viewer') {
    await supabase.from('company_members').update({ role }).eq('id', memberId);
    qc.invalidateQueries({ queryKey: ['company-members', selectedCompany?.id] });
    toast.success('Rooli päivitetty');
  }

  async function removeMember(memberId: string) {
    await supabase.from('company_members').delete().eq('id', memberId);
    qc.invalidateQueries({ queryKey: ['company-members', selectedCompany?.id] });
    toast.success('Jäsen poistettu');
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Yritykset</h1>
          <p className="text-neutral-500 text-sm mt-1">Hallinnoi yrityksiä ja jäseniä</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
          <Plus size={16} />Uusi yritys
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Company list */}
        <div className="col-span-1">
          <div className="text-neutral-500 text-xs uppercase tracking-wider font-medium mb-3">Yritykset</div>
          {isLoading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-neutral-800/30 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-1.5">
              {companies?.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCompany(c)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                    selectedCompany?.id === c.id ? 'bg-neutral-800 border border-neutral-700' : 'hover:bg-neutral-900 border border-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <span className="text-black text-sm font-bold">{c.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{c.name}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteCompany(c.id); }}
                    className="p-1 rounded text-neutral-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company detail */}
        <div className="col-span-2">
          {!selectedCompany ? (
            <div className="h-full flex items-center justify-center text-neutral-700">
              <div className="text-center">
                <Building2 size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Valitse yritys vasemmalta</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <span className="text-black font-bold">{selectedCompany.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{selectedCompany.name}</div>
                    {selectedCompany.description && <div className="text-neutral-500 text-xs">{selectedCompany.description}</div>}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setAddMemberOpen(true)}
                  className="bg-white text-black hover:bg-neutral-100 gap-1.5 h-8"
                >
                  <UserPlus size={14} />Lisää jäsen
                </Button>
              </div>

              <div className="text-neutral-500 text-xs uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
                <Users size={12} />Jäsenet ({members?.length ?? 0})
              </div>

              <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
                {members?.length === 0 ? (
                  <div className="px-5 py-8 text-center text-neutral-600 text-sm">Ei jäseniä</div>
                ) : (
                  members?.map((m, i) => (
                    <div key={m.id} className={`flex items-center gap-4 px-5 py-4 ${i < (members?.length ?? 0) - 1 ? 'border-b border-neutral-800' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-medium">
                          {(m.profiles?.full_name || m.profiles?.email || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{m.profiles?.full_name || '—'}</div>
                        <div className="text-neutral-500 text-xs">{m.profiles?.email}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => changeMemberRole(m.id, m.role === 'admin' ? 'viewer' : 'admin')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            m.role === 'admin'
                              ? 'bg-purple-950/50 text-purple-400 border border-purple-800/50 hover:bg-purple-950'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white hover:bg-neutral-700'
                          }`}
                        >
                          {m.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                          {m.role === 'admin' ? 'Admin' : 'Viewer'}
                        </button>
                        <button
                          onClick={() => removeMember(m.id)}
                          className="p-1.5 rounded text-neutral-600 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <NewCompanyDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={() => { setNewOpen(false); qc.invalidateQueries({ queryKey: ['all-companies'] }); refetch(); }}
        userId={user?.id ?? ''}
      />

      {selectedCompany && (
        <AddMemberDialog
          open={addMemberOpen}
          onClose={() => setAddMemberOpen(false)}
          onAdded={() => { setAddMemberOpen(false); qc.invalidateQueries({ queryKey: ['company-members', selectedCompany.id] }); }}
          companyId={selectedCompany.id}
        />
      )}
    </div>
  );
}

function NewCompanyDialog({ open, onClose, onCreated, userId }: {
  open: boolean; onClose: () => void; onCreated: () => void; userId: string;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!name.trim()) return;
    setSaving(true);
    const slug = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;
    const { data, error } = await supabase.from('companies').insert({
      name: name.trim(), slug, description: description || null, created_by: userId
    }).select().single();

    if (!error && data) {
      // Create brand settings
      await supabase.from('brand_settings').insert({ company_id: data.id });
      // Add creator as admin
      await supabase.from('company_members').insert({ company_id: data.id, user_id: userId, role: 'admin' });
      toast.success('Yritys luotu');
      onCreated();
    } else toast.error('Luominen epäonnistui');
    setSaving(false);
    setName(''); setDescription('');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Building2 size={18} />Uusi yritys
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Yrityksen nimi</Label>
            <Input value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="esim. Acme Oy" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" onKeyDown={e => { if (e.key === 'Enter') create(); }} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Kuvaus (valinnainen)</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Lyhyt kuvaus" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={create} disabled={saving || !name.trim()} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Luodaan...' : 'Luo yritys'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddMemberDialog({ open, onClose, onAdded, companyId }: {
  open: boolean; onClose: () => void; onAdded: () => void; companyId: string;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'viewer'>('viewer');
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!email.trim()) return;
    setSaving(true);
    // Find user by email
    const { data: profiles } = await supabase.from('profiles').select('id').eq('email', email.trim()).single();
    if (!profiles) { toast.error('Käyttäjää ei löydy. Luo käyttäjä ensin Hallinta-sivulta.'); setSaving(false); return; }
    const { error } = await supabase.from('company_members').insert({ company_id: companyId, user_id: profiles.id, role });
    if (error) toast.error('Jäsenen lisääminen epäonnistui');
    else { toast.success('Jäsen lisätty'); onAdded(); setEmail(''); }
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2"><UserPlus size={18} />Lisää jäsen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Sähköposti</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="kayttaja@esimerkki.fi" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['viewer', 'admin'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${role === r ? 'border-white bg-white/10 text-white' : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'}`}>
                {r === 'admin' ? <Shield size={14} /> : <User size={14} />}
                {r === 'admin' ? 'Admin' : 'Viewer'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={add} disabled={saving || !email.trim()} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Lisätään...' : 'Lisää'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
