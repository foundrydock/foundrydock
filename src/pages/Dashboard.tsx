import { useAuth } from '@/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { FolderOpen, Presentation, Link2, ArrowRight, Upload } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();

  const { data: folderCount } = useQuery({
    queryKey: ['folder-count'],
    queryFn: async () => {
      const { count } = await supabase.from('asset_folders').select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: assetCount } = useQuery({
    queryKey: ['asset-count'],
    queryFn: async () => {
      const { count } = await supabase.from('assets').select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: deckCount } = useQuery({
    queryKey: ['deck-count'],
    queryFn: async () => {
      const { count } = await supabase.from('pitchdecks').select('*', { count: 'exact', head: true });
      return count ?? 0;
    },
  });

  const { data: linkCount } = useQuery({
    queryKey: ['link-count'],
    queryFn: async () => {
      const { count } = await supabase.from('share_links').select('*', { count: 'exact', head: true }).eq('is_active', true);
      return count ?? 0;
    },
  });

  const { data: recentAssets } = useQuery({
    queryKey: ['recent-assets'],
    queryFn: async () => {
      const { data } = await supabase
        .from('assets')
        .select('*, asset_folders(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Huomenta';
    if (h < 17) return 'Hei';
    return 'Hei';
  };

  const firstName = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || '';

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">{greeting()}, {firstName}</h1>
        <p className="text-neutral-500 text-sm mt-1">Mittamuoto datapankki</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Kansiot', value: folderCount ?? '—', icon: FolderOpen, to: '/library' },
          { label: 'Tiedostot', value: assetCount ?? '—', icon: Upload, to: '/library' },
          { label: 'Pitchdeckit', value: deckCount ?? '—', icon: Presentation, to: '/pitchdecks' },
          { label: 'Aktiiviset linkit', value: linkCount ?? '—', icon: Link2, to: '/share-links' },
        ].map(stat => (
          <Link
            key={stat.label}
            to={stat.to}
            className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-5 hover:bg-neutral-800 hover:border-neutral-700 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon size={18} className="text-neutral-400" />
              <ArrowRight size={14} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            </div>
            <div className="text-2xl font-semibold text-white tabular-nums">{stat.value}</div>
            <div className="text-neutral-500 text-sm mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">Pikaoikotiet</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/library"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors"
          >
            <Upload size={15} />
            Lisää tiedosto
          </Link>
          <Link
            to="/pitchdecks"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors"
          >
            <Presentation size={15} />
            Uusi pitchdeck
          </Link>
          <Link
            to="/share-links"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors"
          >
            <Link2 size={15} />
            Luo jakölinkki
          </Link>
        </div>
      </div>

      {/* Recent files */}
      {recentAssets && recentAssets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Viimeisimmät tiedostot</h2>
            <Link to="/library" className="text-xs text-neutral-500 hover:text-white transition-colors">Näytä kaikki</Link>
          </div>
          <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
            {recentAssets.map((asset, i) => (
              <div
                key={asset.id}
                className={`flex items-center gap-4 px-5 py-3.5 ${i < recentAssets.length - 1 ? 'border-b border-neutral-800' : ''}`}
              >
                <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center shrink-0">
                  <FileIcon mime={asset.mime_type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{asset.name}</div>
                  <div className="text-neutral-500 text-xs">{(asset as any).asset_folders?.name ?? 'Ei kansiota'}</div>
                </div>
                <div className="text-neutral-600 text-xs tabular-nums">
                  {formatSize(asset.file_size)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FileIcon({ mime }: { mime: string | null }) {
  if (mime?.startsWith('image/')) return <span className="text-xs text-blue-400">IMG</span>;
  if (mime === 'application/pdf') return <span className="text-xs text-red-400">PDF</span>;
  if (mime?.includes('presentation') || mime?.includes('powerpoint')) return <span className="text-xs text-orange-400">PPT</span>;
  return <span className="text-xs text-neutral-400">DOC</span>;
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
