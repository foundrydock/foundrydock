import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Link2, Copy, Check, Trash2, Eye, EyeOff, Globe, Lock, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, isPast } from 'date-fns';
import { fi } from 'date-fns/locale';

type ShareLink = Tables<'share_links'>;

export default function ShareLinks() {
  const qc = useQueryClient();
  const [copied, setCopied] = useState<string | null>(null);

  const { data: links, isLoading } = useQuery({
    queryKey: ['share-links'],
    queryFn: async () => {
      const { data } = await supabase
        .from('share_links')
        .select('*')
        .order('created_at', { ascending: false });
      return (data ?? []) as ShareLink[];
    },
  });

  async function toggleActive(link: ShareLink) {
    await supabase.from('share_links').update({ is_active: !link.is_active }).eq('id', link.id);
    qc.invalidateQueries({ queryKey: ['share-links'] });
    toast.success(link.is_active ? 'Linkki poistettu käytöstä' : 'Linkki aktivoitu');
  }

  async function deleteLink(id: string) {
    if (!confirm('Poistetaanko jakölinkki pysyvästi?')) return;
    await supabase.from('share_links').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['share-links'] });
    toast.success('Linkki poistettu');
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    toast.success('Linkki kopioitu!');
    setTimeout(() => setCopied(null), 2000);
  }

  const getTargetLabel = (link: ShareLink) => {
    if (link.folder_id) return 'Kansio';
    if (link.asset_id) return 'Tiedosto';
    if (link.pitchdeck_id) return 'Pitchdeck';
    return '—';
  };

  const isExpired = (link: ShareLink) =>
    link.expires_at ? isPast(new Date(link.expires_at)) : false;

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Jakolinkit</h1>
          <p className="text-neutral-500 text-sm mt-1">Hallinnoi kaikkia jakolinkkejä</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-800/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : links?.length === 0 ? (
        <div className="text-center py-16 text-neutral-600">
          <Link2 size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Ei jakolinkkejä vielä</p>
          <p className="text-xs mt-1">Luo linkki materiaalipankista tai pitchdeckeistä</p>
        </div>
      ) : (
        <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Nimi</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Kohde</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Suojaus</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Voimassa</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Avauksia</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Tila</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {links?.map((link, i) => {
                const expired = isExpired(link);
                const inactive = !link.is_active || expired;
                return (
                  <tr key={link.id} className={`${i < links.length - 1 ? 'border-b border-neutral-800' : ''} ${inactive ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="text-white text-sm font-medium">{link.title}</div>
                      <div className="text-neutral-600 text-xs font-mono truncate max-w-32">{link.token}</div>
                    </td>
                    <td className="px-5 py-4 text-neutral-400 text-sm">{getTargetLabel(link)}</td>
                    <td className="px-5 py-4">
                      {link.password_hash ? (
                        <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                          <Lock size={12} />Salasana
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-green-400">
                          <Globe size={12} />Avoin
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {link.expires_at ? (
                        <span className={`flex items-center gap-1.5 text-xs ${expired ? 'text-red-400' : 'text-neutral-400'}`}>
                          <Clock size={12} />
                          {expired ? 'Vanhentunut' : formatDistanceToNow(new Date(link.expires_at), { addSuffix: true, locale: fi })}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-600">Ikuinen</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-400 text-sm tabular-nums">{link.view_count}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        expired ? 'bg-red-950/50 text-red-400'
                        : link.is_active ? 'bg-green-950/50 text-green-400'
                        : 'bg-neutral-800 text-neutral-500'
                      }`}>
                        {expired ? 'Vanhentunut' : link.is_active ? 'Aktiivinen' : 'Pois käytöstä'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => copyLink(link.token)}
                          className="p-1.5 rounded text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
                          title="Kopioi linkki"
                        >
                          {copied === link.token ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => toggleActive(link)}
                          className="p-1.5 rounded text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors"
                          title={link.is_active ? 'Poista käytöstä' : 'Aktivoi'}
                        >
                          {link.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                          title="Poista pysyvästi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
