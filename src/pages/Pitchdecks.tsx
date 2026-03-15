import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShareDialog from '@/components/library/ShareDialog';
import {
  Presentation, Plus, Pencil, Trash2, Copy, Link2, Play, MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fi } from 'date-fns/locale';

type Pitchdeck = Tables<'pitchdecks'>;

const TEMPLATES = [
  { id: 'mittamuoto', label: 'Mittamuoto', description: 'Standardi pitchdeck' },
  { id: 'showcase', label: 'Showcase', description: 'Interaktiivinen demo' },
  { id: 'demo', label: 'Demo', description: 'Tyhjä template' },
];

export default function Pitchdecks() {
  const { user } = useAuth();
  const { activeCompany } = useCompany();
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Pitchdeck | null>(null);
  const [shareTarget, setShareTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: decks, isLoading } = useQuery({
    queryKey: ['pitchdecks', activeCompany?.id],
    queryFn: async () => {
      let q = supabase.from('pitchdecks').select('*').order('updated_at', { ascending: false } as any);
      if (activeCompany?.id) q = q.eq('company_id', activeCompany.id);
      const { data } = await q;
      return (data ?? []) as Pitchdeck[];
    },
  });

  async function deleteDeck(deck: Pitchdeck) {
    if (!confirm(`Poistetaanko "${deck.name}"? Kaikki muokkaukset menetetään.`)) return;
    await supabase.from('pitchdecks').delete().eq('id', deck.id);
    qc.invalidateQueries({ queryKey: ['pitchdecks'] });
    toast.success('Pitchdeck poistettu');
  }

  async function cloneDeck(deck: Pitchdeck) {
    const { data, error } = await supabase.from('pitchdecks').insert({
      name: `${deck.name} (kopio)`,
      template: deck.template,
      slide_order: deck.slide_order,
      hidden_slides: deck.hidden_slides,
      style_overrides: deck.style_overrides,
      overrides_key: `deck-${Date.now()}`,
      created_by: user?.id,
    }).select().single();

    if (!error && data) {
      // Copy content overrides
      const { data: overrides } = await supabase
        .from('content_overrides')
        .select('*')
        .eq('deck_key', deck.overrides_key ?? '');

      if (overrides?.length) {
        await supabase.from('content_overrides').insert(
          overrides.map(o => ({ ...o, id: undefined, deck_key: data.overrides_key }))
        );
      }

      qc.invalidateQueries({ queryKey: ['pitchdecks'] });
      toast.success('Pitchdeck kopioitu');
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pitchdeckit</h1>
          <p className="text-neutral-500 text-sm mt-1">Luo, muokkaa ja jaa pitchdeckit</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
          <Plus size={16} />
          Uusi pitchdeck
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-neutral-800/30 rounded-xl animate-pulse" />)}
        </div>
      ) : decks?.length === 0 ? (
        <div className="text-center py-20 text-neutral-600">
          <Presentation size={36} className="mx-auto mb-4 opacity-40" />
          <p className="text-sm">Ei pitchdeckejä vielä</p>
          <p className="text-xs mt-1">Luo ensimmäinen pitchdeck yllä olevasta napista</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks?.map(deck => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onDelete={() => deleteDeck(deck)}
              onClone={() => cloneDeck(deck)}
              onRename={() => setRenameTarget(deck)}
              onShare={() => setShareTarget({ id: deck.id, name: deck.name })}
            />
          ))}
        </div>
      )}

      <NewDeckDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => { setNewOpen(false); qc.invalidateQueries({ queryKey: ['pitchdecks', activeCompany?.id] }); }}
        companyId={activeCompany?.id ?? null}
      />

      {renameTarget && (
        <RenameDeckDialog
          deck={renameTarget}
          onClose={() => setRenameTarget(null)}
          onSaved={() => { setRenameTarget(null); qc.invalidateQueries({ queryKey: ['pitchdecks'] }); }}
        />
      )}

      {shareTarget && (
        <ShareDialog
          open={!!shareTarget}
          onClose={() => setShareTarget(null)}
          target={{ type: 'pitchdeck', id: shareTarget.id, name: shareTarget.name }}
        />
      )}
    </div>
  );
}

function DeckCard({
  deck, onDelete, onClone, onRename, onShare
}: {
  deck: Pitchdeck;
  onDelete: () => void;
  onClone: () => void;
  onRename: () => void;
  onShare: () => void;
}) {
  const templateInfo = TEMPLATES.find(t => t.id === deck.template);

  return (
    <div className="group bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-5 hover:border-neutral-700 hover:bg-neutral-800/60 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-neutral-700/50 rounded-lg flex items-center justify-center">
          <Presentation size={20} className="text-neutral-300" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded text-neutral-600 hover:text-white hover:bg-neutral-700 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white" align="end">
            <DropdownMenuItem asChild className="gap-2 hover:bg-neutral-700 cursor-pointer">
              <Link to={`/pitchdecks/${deck.id}/edit`}>
                <Pencil size={14} />Muokkaa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onShare}>
              <Link2 size={14} />Jaa linkki
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onRename}>
              <Pencil size={14} />Nimeä uudelleen
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onClone}>
              <Copy size={14} />Kopioi
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer text-red-400" onClick={onDelete}>
              <Trash2 size={14} />Poista
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-white font-medium text-sm mb-1">{deck.name}</div>
      <div className="text-neutral-500 text-xs mb-4">
        {templateInfo?.label} · Muokattu {formatDistanceToNow(new Date(deck.updated_at), { addSuffix: true, locale: fi })}
      </div>

      <div className="flex gap-2">
        <Link
          to={`/pitchdecks/${deck.id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded-lg transition-colors"
        >
          <Pencil size={13} />
          Muokkaa
        </Link>
        <Link
          to={`/pitchdecks/${deck.id}/edit`}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded-lg transition-colors"
          onClick={(e) => {
            // TODO: trigger presentation mode
          }}
        >
          <Play size={13} />
          Esitä
        </Link>
        <button
          onClick={onShare}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded-lg transition-colors"
        >
          <Link2 size={13} />
        </button>
      </div>
    </div>
  );
}

function NewDeckDialog({ open, onClose, onCreated, companyId }: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
  companyId: string | null;
}) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('mittamuoto');
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    const overridesKey = `deck-${Date.now()}`;
    const { data, error } = await supabase.from('pitchdecks').insert({
      name: name.trim(),
      template,
      overrides_key: overridesKey,
      created_by: user?.id,
      ...(companyId ? { company_id: companyId } : {}),
    }).select().single();

    if (!error && data) onCreated(data.id);
    else toast.error('Luominen epäonnistui');
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Presentation size={18} />
            Uusi pitchdeck
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Nimi</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="esim. Sijoittajapitch Q1 2026"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Template</Label>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                    template === t.id ? 'border-white bg-white/10' : 'border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${template === t.id ? 'bg-white' : 'bg-neutral-600'}`} />
                  <div>
                    <div className={`text-sm font-medium ${template === t.id ? 'text-white' : 'text-neutral-300'}`}>{t.label}</div>
                    <div className="text-xs text-neutral-500">{t.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={handleCreate} disabled={saving || !name.trim()} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Luodaan...' : 'Luo pitchdeck'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RenameDeckDialog({ deck, onClose, onSaved }: {
  deck: Pitchdeck;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(deck.name);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await supabase.from('pitchdecks').update({ name: name.trim() }).eq('id', deck.id);
    toast.success('Nimi päivitetty');
    onSaved();
    setSaving(false);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Nimeä uudelleen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-neutral-800 border-neutral-700 text-white"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') save(); }}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={save} disabled={saving || !name.trim()} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Tallennetaan...' : 'Tallenna'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
