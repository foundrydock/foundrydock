import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import ShareDialog from '@/components/library/ShareDialog';
import {
  Upload, ArrowLeft, Globe, Lock, Link2, MoreHorizontal,
  FileImage, FileText, Film, File, Download, Trash2, Eye
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type Asset = Tables<'assets'>;
type Folder = Tables<'asset_folders'>;

export default function LibraryFolder() {
  const { folderId } = useParams<{ folderId: string }>();
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [shareTarget, setShareTarget] = useState<{ id: string; name: string } | null>(null);
  const [preview, setPreview] = useState<Asset | null>(null);

  const { data: folder } = useQuery({
    queryKey: ['folder', folderId],
    queryFn: async () => {
      const { data } = await supabase.from('asset_folders').select('*').eq('id', folderId!).single();
      return data as Folder;
    },
    enabled: !!folderId,
  });

  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets', folderId],
    queryFn: async () => {
      const { data } = await supabase
        .from('assets')
        .select('*')
        .eq('folder_id', folderId!)
        .order('created_at', { ascending: false });
      return (data ?? []) as Asset[];
    },
    enabled: !!folderId,
  });

  async function handleUpload(files: FileList | null) {
    if (!files || !folderId) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${folderId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        toast.error(`${file.name}: lataus epäonnistui`);
        continue;
      }

      await supabase.from('assets').insert({
        folder_id: folderId,
        name: file.name.replace(/\.[^/.]+$/, ''),
        file_name: file.name,
        file_path: path,
        file_type: ext ?? 'bin',
        file_size: file.size,
        mime_type: file.type,
        created_by: user?.id,
      });

      toast.success(`${file.name} lisätty`);
    }

    qc.invalidateQueries({ queryKey: ['assets', folderId] });
    setUploading(false);
  }

  async function deleteAsset(asset: Asset) {
    if (!confirm(`Poistetaanko "${asset.name}"?`)) return;
    await supabase.storage.from('assets').remove([asset.file_path]);
    await supabase.from('assets').delete().eq('id', asset.id);
    qc.invalidateQueries({ queryKey: ['assets', folderId] });
    toast.success('Tiedosto poistettu');
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

  async function getPreviewUrl(asset: Asset): Promise<string | null> {
    const { data } = await supabase.storage.from('assets').createSignedUrl(asset.file_path, 300);
    return data?.signedUrl ?? null;
  }

  const accessInfo = folder ? {
    public: { label: 'Julkinen', icon: Globe, color: 'text-green-400' },
    link: { label: 'Linkillä', icon: Link2, color: 'text-yellow-400' },
    private: { label: 'Yksityinen', icon: Lock, color: 'text-neutral-400' },
  }[folder.access_level] : null;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Link to="/library" className="text-neutral-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold text-white">{folder?.name ?? '...'}</h1>
        {accessInfo && (
          <div className={`flex items-center gap-1.5 text-xs ${accessInfo.color} ml-1`}>
            <accessInfo.icon size={12} />
            {accessInfo.label}
          </div>
        )}
      </div>
      {folder?.description && (
        <p className="text-neutral-500 text-sm mb-6 ml-7">{folder.description}</p>
      )}

      {isAdmin && (
        <div className="flex gap-3 mb-8 ml-7">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-white text-black hover:bg-neutral-100 gap-2"
          >
            <Upload size={16} />
            {uploading ? 'Ladataan...' : 'Lisää tiedostoja'}
          </Button>
          {folder && (
            <Button
              variant="outline"
              onClick={() => setShareTarget({ id: folder.id, name: folder.name })}
              className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 gap-2"
            >
              <Link2 size={16} />
              Jaa kansio
            </Button>
          )}
        </div>
      )}

      {/* Drag & drop zone */}
      {isAdmin && (
        <div
          className="border-2 border-dashed border-neutral-700 hover:border-neutral-600 rounded-xl p-8 mb-8 text-center cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        >
          <Upload size={24} className="text-neutral-600 mx-auto mb-2" />
          <p className="text-neutral-500 text-sm">Raahaa tiedostoja tähän tai <span className="text-white">selaa</span></p>
          <p className="text-neutral-600 text-xs mt-1">Max 50 MB / tiedosto</p>
        </div>
      )}

      {/* Files grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 bg-neutral-800/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : assets?.length === 0 ? (
        <div className="text-center py-16 text-neutral-600">
          <File size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Kansiossa ei ole tiedostoja</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assets?.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isAdmin={isAdmin}
              onDelete={() => deleteAsset(asset)}
              onDownload={() => downloadAsset(asset)}
              onShare={() => setShareTarget({ id: asset.id, name: asset.name })}
              onPreview={() => setPreview(asset)}
            />
          ))}
        </div>
      )}

      {shareTarget && folder && (
        <ShareDialog
          open={!!shareTarget}
          onClose={() => setShareTarget(null)}
          target={{ type: 'asset', id: shareTarget.id, name: shareTarget.name }}
        />
      )}

      {preview && (
        <AssetPreviewModal
          asset={preview}
          onClose={() => setPreview(null)}
          getUrl={getPreviewUrl}
        />
      )}
    </div>
  );
}

function AssetCard({
  asset, isAdmin, onDelete, onDownload, onShare, onPreview
}: {
  asset: Asset;
  isAdmin: boolean;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
  onPreview: () => void;
}) {
  const isImage = asset.mime_type?.startsWith('image/');

  return (
    <div className="group relative bg-neutral-800/40 border border-neutral-700/50 rounded-xl overflow-hidden hover:border-neutral-700 transition-colors">
      {/* Thumbnail */}
      <div
        className="h-28 bg-neutral-800 flex items-center justify-center cursor-pointer"
        onClick={onPreview}
      >
        {isImage ? (
          <AssetThumbnail asset={asset} />
        ) : (
          <FileIconLarge mime={asset.mime_type} />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="text-white text-xs font-medium truncate mb-0.5">{asset.name}</div>
        <div className="text-neutral-600 text-xs">{formatSize(asset.file_size)}</div>
      </div>

      {/* Actions overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md bg-neutral-900/80 backdrop-blur text-neutral-300 hover:text-white">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white" align="end">
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onPreview}>
              <Eye size={14} />Esikatselu
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onDownload}>
              <Download size={14} />Lataa
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer" onClick={onShare}>
                  <Link2 size={14} />Jaa
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer text-red-400" onClick={onDelete}>
                  <Trash2 size={14} />Poista
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function AssetThumbnail({ asset }: { asset: Asset }) {
  const [url, setUrl] = useState<string | null>(null);
  useState(() => {
    supabase.storage.from('assets').createSignedUrl(asset.file_path, 300).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  });
  if (!url) return <FileIconLarge mime={asset.mime_type} />;
  return <img src={url} alt={asset.name} className="w-full h-full object-cover" />;
}

function FileIconLarge({ mime }: { mime: string | null }) {
  if (mime?.startsWith('image/')) return <FileImage size={28} className="text-blue-400" />;
  if (mime === 'application/pdf') return <FileText size={28} className="text-red-400" />;
  if (mime?.startsWith('video/')) return <Film size={28} className="text-purple-400" />;
  return <File size={28} className="text-neutral-400" />;
}

function AssetPreviewModal({
  asset, onClose, getUrl
}: {
  asset: Asset;
  onClose: () => void;
  getUrl: (a: Asset) => Promise<string | null>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useState(() => { getUrl(asset).then(setUrl); });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div className="text-white font-medium text-sm">{asset.name}</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors text-lg leading-none">×</button>
        </div>
        <div className="p-6 flex items-center justify-center min-h-64">
          {url ? (
            asset.mime_type?.startsWith('image/') ? (
              <img src={url} alt={asset.name} className="max-w-full max-h-[60vh] object-contain rounded-lg" />
            ) : asset.mime_type === 'application/pdf' ? (
              <iframe src={url} className="w-full h-[60vh] rounded-lg" title={asset.name} />
            ) : (
              <div className="text-center">
                <FileIconLarge mime={asset.mime_type} />
                <p className="text-neutral-400 text-sm mt-3">Esikatselu ei saatavilla</p>
                <a href={url} download={asset.file_name} className="text-white text-sm underline mt-2 inline-block">Lataa tiedosto</a>
              </div>
            )
          ) : (
            <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
