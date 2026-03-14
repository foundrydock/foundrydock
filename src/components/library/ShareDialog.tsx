import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { Copy, Check, Link2, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  target:
    | { type: 'folder'; id: string; name: string }
    | { type: 'asset'; id: string; name: string }
    | { type: 'pitchdeck'; id: string; name: string };
}

export default function ShareDialog({ open, onClose, target }: ShareDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(target.name);
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [expiresIn, setExpiresIn] = useState('');
  const [creating, setCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const payload: Record<string, unknown> = {
        title,
        created_by: user?.id,
        is_active: true,
      };

      if (target.type === 'folder') payload.folder_id = target.id;
      if (target.type === 'asset') payload.asset_id = target.id;
      if (target.type === 'pitchdeck') payload.pitchdeck_id = target.id;
      if (usePassword && password) payload.password_hash = password; // stored plaintext for now, check on view
      if (expiresIn) {
        const days = parseInt(expiresIn);
        if (!isNaN(days)) {
          const exp = new Date();
          exp.setDate(exp.getDate() + days);
          payload.expires_at = exp.toISOString();
        }
      }

      const { data, error } = await supabase
        .from('share_links')
        .insert(payload)
        .select('token')
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/share/${data.token}`;
      setGeneratedLink(link);
    } catch (e) {
      toast.error('Linkin luominen epäonnistui');
    }
    setCreating(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Linkki kopioitu!');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setGeneratedLink('');
    setTitle(target.name);
    setPassword('');
    setUsePassword(false);
    setExpiresIn('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Link2 size={18} />
            Luo jakölinkki
          </DialogTitle>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-4 mt-2">
            <div className="bg-neutral-800/50 rounded-lg px-4 py-3 text-sm text-neutral-400">
              Jaetaan: <span className="text-white font-medium">{target.name}</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-neutral-300 text-sm">Linkin nimi</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-300 text-sm">Suojaus</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUsePassword(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    !usePassword
                      ? 'border-white bg-white/10 text-white'
                      : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <Globe size={14} />
                  Avoin linkki
                </button>
                <button
                  onClick={() => setUsePassword(true)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    usePassword
                      ? 'border-white bg-white/10 text-white'
                      : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <Lock size={14} />
                  Salasanasuojattu
                </button>
              </div>
              {usePassword && (
                <Input
                  placeholder="Salasana"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-neutral-300 text-sm">Voimassaoloaika (päivää, tyhjä = ikuinen)</Label>
              <Input
                type="number"
                placeholder="esim. 30"
                value={expiresIn}
                onChange={e => setExpiresIn(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600"
                min="1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">
                Peruuta
              </Button>
              <Button onClick={handleCreate} disabled={creating || !title} className="flex-1 bg-white text-black hover:bg-neutral-100">
                {creating ? 'Luodaan...' : 'Luo linkki'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <div className="bg-green-950/50 border border-green-800/50 rounded-lg px-4 py-3 text-sm text-green-400">
              Linkki luotu onnistuneesti!
            </div>
            <div className="space-y-1.5">
              <Label className="text-neutral-300 text-sm">Jakölinkki</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={generatedLink}
                  className="bg-neutral-800 border-neutral-700 text-white text-xs"
                />
                <Button onClick={copyLink} size="icon" variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 shrink-0">
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
            {usePassword && password && (
              <div className="bg-neutral-800/50 rounded-lg px-4 py-3 text-sm">
                <span className="text-neutral-400">Salasana: </span>
                <span className="text-white font-mono">{password}</span>
              </div>
            )}
            <Button onClick={handleClose} className="w-full bg-white text-black hover:bg-neutral-100">
              Valmis
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
