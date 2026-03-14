import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ShareDialog from '@/components/library/ShareDialog';
import {
  FolderOpen, Plus, Globe, Lock, Link2, MoreHorizontal, Pencil, Trash2
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type Folder = Tables<'asset_folders'>;

const ACCESS_LABELS = {
  public: { label: 'Julkinen', icon: Globe, color: 'text-green-400' },
  link: { label: 'Linkillä', icon: Link2, color: 'text-yellow-400' },
  private: { label: 'Yksityinen', icon: Lock, color: 'text-neutral-400' },
};

export default function Library() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [editFolder, setEditFolder] = useState<Folder | null>(null);
  const [shareTarget, setShareTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: folders, isLoading } = useQuery({
    queryKey: ['asset-folders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('asset_folders')
        .select('*')
        .is('parent_id', null)
        .order('sort_order');
      return (data ?? []) as Folder[];
    },
  });

  async function deleteFolder(id: string) {
    if (!confirm('Poistetaanko kansio? Kaikki tiedostot poistetaan myös.')) return;
    await supabase.from('asset_folders').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['asset-folders'] });
    toast.success('Kansio poistettu');
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Materiaalipankki</h1>
          <p className="text-neutral-500 text-sm mt-1">Kaikki Mittamuodon materiaalit</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setNewFolderOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
            <Plus size={16} />
            Uusi kansio
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-800/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {folders?.map(folder => {
            const access = ACCESS_LABELS[folder.access_level];
            const AccessIcon = access.icon;
            return (
              <div key={folder.id} className="group relative bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-5 hover:bg-neutral-800 hover:border-neutral-700 transition-colors">
                <Link to={`/library/${folder.id}`} className="absolute inset-0 rounded-xl" />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-neutral-700/50 rounded-lg flex items-center justify-center">
                    <FolderOpen size={20} className="text-neutral-300" />
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="relative z-10 p-1 rounded text-neutral-600 hover:text-white hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={e => e.preventDefault()}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white" align="end">
                        <DropdownMenuItem
                          className="gap-2 hover:bg-neutral-700 cursor-pointer"
                          onClick={() => setShareTarget({ id: folder.id, name: folder.name })}
                        >
                          <Link2 size={14} />
                          Jaa linkki
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 hover:bg-neutral-700 cursor-pointer"
                          onClick={() => setEditFolder(folder)}
                        >
                          <Pencil size={14} />
                          Muokkaa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 hover:bg-neutral-700 cursor-pointer text-red-400"
                          onClick={() => deleteFolder(folder.id)}
                        >
                          <Trash2 size={14} />
                          Poista
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="text-white font-medium text-sm mb-1">{folder.name}</div>
                {folder.description && (
                  <div className="text-neutral-500 text-xs mb-3 line-clamp-2">{folder.description}</div>
                )}
                <div className={`flex items-center gap-1.5 text-xs ${access.color}`}>
                  <AccessIcon size={12} />
                  {access.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New folder dialog */}
      <FolderFormDialog
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
        onSaved={() => { setNewFolderOpen(false); qc.invalidateQueries({ queryKey: ['asset-folders'] }); }}
      />

      {/* Edit folder dialog */}
      {editFolder && (
        <FolderFormDialog
          open={!!editFolder}
          folder={editFolder}
          onClose={() => setEditFolder(null)}
          onSaved={() => { setEditFolder(null); qc.invalidateQueries({ queryKey: ['asset-folders'] }); }}
        />
      )}

      {/* Share dialog */}
      {shareTarget && (
        <ShareDialog
          open={!!shareTarget}
          onClose={() => setShareTarget(null)}
          target={{ type: 'folder', id: shareTarget.id, name: shareTarget.name }}
        />
      )}
    </div>
  );
}

interface FolderFormDialogProps {
  open: boolean;
  folder?: Folder;
  onClose: () => void;
  onSaved: () => void;
}

function FolderFormDialog({ open, folder, onClose, onSaved }: FolderFormDialogProps) {
  const { user } = useAuth();
  const [name, setName] = useState(folder?.name ?? '');
  const [description, setDescription] = useState(folder?.description ?? '');
  const [access, setAccess] = useState<'public' | 'link' | 'private'>(folder?.access_level ?? 'private');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (folder) {
      await supabase.from('asset_folders').update({ name, description, access_level: access }).eq('id', folder.id);
    } else {
      await supabase.from('asset_folders').insert({
        name, description, access_level: access, slug: `${slug}-${Date.now()}`, created_by: user?.id
      });
    }
    setSaving(false);
    onSaved();
    toast.success(folder ? 'Kansio päivitetty' : 'Kansio luotu');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{folder ? 'Muokkaa kansiota' : 'Uusi kansio'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Nimi</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Kansion nimi" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Kuvaus</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" placeholder="Valinnainen kuvaus" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Näkyvyys</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['public', 'link', 'private'] as const).map(a => {
                const info = ACCESS_LABELS[a];
                const Icon = info.icon;
                return (
                  <button
                    key={a}
                    onClick={() => setAccess(a)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs transition-colors ${
                      access === a ? 'border-white bg-white/10 text-white' : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <Icon size={14} />
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
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
