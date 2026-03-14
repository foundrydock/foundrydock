import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Download, File, FileImage, FileText, Film } from 'lucide-react';

type ShareLink = Tables<'share_links'>;
type Asset = Tables<'assets'>;
type Folder = Tables<'asset_folders'>;

type ViewState = 'loading' | 'password' | 'expired' | 'notfound' | 'ready';

export default function ShareView() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<ViewState>('loading');
  const [link, setLink] = useState<ShareLink | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [folder, setFolder] = useState<Folder | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [singleAsset, setSingleAsset] = useState<Asset | null>(null);
  const [assetUrl, setAssetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (token) loadLink(token);
  }, [token]);

  async function loadLink(token: string) {
    const { data: linkData } = await supabase
      .from('share_links')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (!linkData) { setState('notfound'); return; }

    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      setState('expired'); return;
    }

    setLink(linkData);

    if (linkData.password_hash) {
      setState('password');
    } else {
      await loadContent(linkData);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link) return;
    if (password === link.password_hash) {
      setPasswordError('');
      await loadContent(link);
      // increment view count
      await supabase.from('share_links').update({
        view_count: (link.view_count ?? 0) + 1,
        last_viewed_at: new Date().toISOString(),
      }).eq('id', link.id);
    } else {
      setPasswordError('Väärä salasana');
    }
  }

  async function loadContent(link: ShareLink) {
    if (link.folder_id) {
      const { data: folderData } = await supabase.from('asset_folders').select('*').eq('id', link.folder_id).single();
      const { data: assetsData } = await supabase.from('assets').select('*').eq('folder_id', link.folder_id).order('created_at', { ascending: false });
      setFolder(folderData);
      setAssets((assetsData ?? []) as Asset[]);
      setState('ready');
    } else if (link.asset_id) {
      const { data: assetData } = await supabase.from('assets').select('*').eq('id', link.asset_id).single();
      if (assetData) {
        setSingleAsset(assetData as Asset);
        const { data: urlData } = await supabase.storage.from('assets').createSignedUrl(assetData.file_path, 3600);
        if (urlData?.signedUrl) setAssetUrl(urlData.signedUrl);
      }
      setState('ready');
    }

    if (!link.password_hash) {
      await supabase.from('share_links').update({
        view_count: (link.view_count ?? 0) + 1,
        last_viewed_at: new Date().toISOString(),
      }).eq('id', link.id);
    }
  }

  async function downloadAsset(asset: Asset) {
    const { data } = await supabase.storage.from('assets').createSignedUrl(asset.file_path, 60);
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = asset.file_name;
      a.click();
    }
  }

  // Loading
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (state === 'notfound') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-center p-4">
        <div>
          <div className="text-neutral-600 text-6xl mb-4">404</div>
          <div className="text-white text-lg font-medium">Linkkiä ei löydy</div>
          <div className="text-neutral-500 text-sm mt-2">Linkki saattaa olla poistettu tai se ei ole koskaan ollut olemassa.</div>
        </div>
      </div>
    );
  }

  // Expired
  if (state === 'expired') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-center p-4">
        <div>
          <div className="text-neutral-600 text-5xl mb-4">⏱</div>
          <div className="text-white text-lg font-medium">Linkki on vanhentunut</div>
          <div className="text-neutral-500 text-sm mt-2">Pyydä uusi linkki lähettäjältä.</div>
        </div>
      </div>
    );
  }

  // Password gate
  if (state === 'password') {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-neutral-300" />
            </div>
            <div className="text-white text-lg font-medium">{link?.title}</div>
            <div className="text-neutral-500 text-sm mt-1">Tämä sisältö on suojattu salasanalla</div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Syötä salasana"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600"
            />
            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
            <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-100">
              Avaa sisältö
            </Button>
          </form>
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-neutral-600 text-xs">
              <div className="w-4 h-4 rounded-sm bg-neutral-700" />
              Mittamuoto Datapankki
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Content
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-800 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm bg-white shrink-0" />
            <div>
              <div className="text-white font-medium text-sm">{link?.title}</div>
              <div className="text-neutral-500 text-xs">Mittamuoto</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Single asset */}
        {singleAsset && (
          <div className="text-center">
            <div className="mb-6">
              <div className="text-white text-xl font-semibold mb-1">{singleAsset.name}</div>
              <div className="text-neutral-500 text-sm">{formatSize(singleAsset.file_size)}</div>
            </div>
            {assetUrl && singleAsset.mime_type?.startsWith('image/') && (
              <img src={assetUrl} alt={singleAsset.name} className="max-w-full max-h-[60vh] object-contain rounded-xl mx-auto mb-6" />
            )}
            {assetUrl && singleAsset.mime_type === 'application/pdf' && (
              <iframe src={assetUrl} className="w-full h-[60vh] rounded-xl mb-6" title={singleAsset.name} />
            )}
            <Button onClick={() => downloadAsset(singleAsset)} className="bg-white text-black hover:bg-neutral-100 gap-2">
              <Download size={16} />
              Lataa tiedosto
            </Button>
          </div>
        )}

        {/* Folder */}
        {folder && (
          <>
            <div className="mb-6">
              <h1 className="text-white text-xl font-semibold">{folder.name}</h1>
              {folder.description && <p className="text-neutral-500 text-sm mt-1">{folder.description}</p>}
              <p className="text-neutral-600 text-xs mt-2">{assets.length} tiedostoa</p>
            </div>
            {assets.length === 0 ? (
              <div className="text-center py-16 text-neutral-600">
                <p className="text-sm">Kansiossa ei ole tiedostoja</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
                    <div className="h-28 bg-neutral-800 flex items-center justify-center">
                      <PublicAssetThumb asset={asset} />
                    </div>
                    <div className="p-3">
                      <div className="text-white text-xs font-medium truncate mb-0.5">{asset.name}</div>
                      <div className="text-neutral-600 text-xs mb-2">{formatSize(asset.file_size)}</div>
                      <button
                        onClick={() => downloadAsset(asset)}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        <Download size={12} />Lataa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PublicAssetThumb({ asset }: { asset: Asset }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (asset.mime_type?.startsWith('image/')) {
      supabase.storage.from('assets').createSignedUrl(asset.file_path, 300).then(({ data }) => {
        if (data?.signedUrl) setUrl(data.signedUrl);
      });
    }
  }, [asset]);

  if (url) return <img src={url} alt={asset.name} className="w-full h-full object-cover" />;
  if (asset.mime_type?.startsWith('image/')) return <FileImage size={28} className="text-blue-400" />;
  if (asset.mime_type === 'application/pdf') return <FileText size={28} className="text-red-400" />;
  if (asset.mime_type?.startsWith('video/')) return <Film size={28} className="text-purple-400" />;
  return <File size={28} className="text-neutral-400" />;
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
