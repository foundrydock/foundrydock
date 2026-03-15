import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { Tables, Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus, FileText, File, FileImage, Trash2, Pencil, MoreHorizontal,
  Upload, Download, Eye, Files, Clock, CheckCircle2
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fi } from 'date-fns/locale';

type Document = Tables<'documents'>;
type Template = Tables<'document_templates'>;
type Asset = Tables<'assets'>;

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  board_minutes: { label: 'Pöytäkirja', color: 'text-purple-400' },
  contract:      { label: 'Sopimus', color: 'text-blue-400' },
  nda:           { label: 'NDA', color: 'text-orange-400' },
  brand_guidelines: { label: 'Brand', color: 'text-pink-400' },
  general:       { label: 'Yleinen', color: 'text-neutral-400' },
  other:         { label: 'Muu', color: 'text-neutral-400' },
};

type Tab = 'documents' | 'files';

export default function Documents() {
  const { user } = useAuth();
  const { activeCompany, isCompanyAdmin } = useCompany();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>('documents');
  const [newDocOpen, setNewDocOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['documents', activeCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('company_id', activeCompany!.id)
        .order('updated_at', { ascending: false });
      return (data ?? []) as Document[];
    },
    enabled: !!activeCompany?.id,
  });

  // "Muut tiedostot" = assets in the 'Muut materiaalit' or 'Sopimukset' folders, or no folder
  const { data: otherFiles, isLoading: filesLoading } = useQuery({
    queryKey: ['other-assets', activeCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('assets')
        .select('*, asset_folders(name, slug)' as any)
        .eq('company_id', activeCompany!.id)
        .order('created_at', { ascending: false });
      return (data ?? []) as unknown as (Asset & { asset_folders: { name: string; slug: string } | null })[];
    },
    enabled: !!activeCompany?.id,
  });

  async function deleteDocument(id: string) {
    if (!confirm('Poistetaanko dokumentti?')) return;
    await supabase.from('documents').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['documents', activeCompany?.id] });
    toast.success('Dokumentti poistettu');
  }

  async function handleFileUpload(files: FileList | null) {
    if (!files || !activeCompany) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${activeCompany.id}/docs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(path, file, { contentType: file.type });
      if (uploadError) { toast.error(`${file.name}: lataus epäonnistui`); continue; }
      await supabase.from('assets').insert({
        company_id: activeCompany.id,
        name: file.name.replace(/\.[^/.]+$/, ''),
        file_name: file.name, file_path: path,
        file_type: ext ?? 'bin', file_size: file.size, mime_type: file.type,
        created_by: user?.id,
      });
      toast.success(`${file.name} lisätty`);
    }
    qc.invalidateQueries({ queryKey: ['other-assets', activeCompany?.id] });
    setUploading(false);
  }

  async function downloadAsset(asset: Asset) {
    const { data } = await supabase.storage.from('assets').createSignedUrl(asset.file_path, 60);
    if (data?.signedUrl) { const a = document.createElement('a'); a.href = data.signedUrl; a.download = asset.file_name; a.click(); }
  }

  async function deleteAsset(asset: Asset) {
    if (!confirm(`Poistetaanko "${asset.name}"?`)) return;
    await supabase.storage.from('assets').remove([asset.file_path]);
    await supabase.from('assets').delete().eq('id', asset.id);
    qc.invalidateQueries({ queryKey: ['other-assets', activeCompany?.id] });
    toast.success('Tiedosto poistettu');
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dokumentit</h1>
          <p className="text-neutral-500 text-sm mt-1">{activeCompany?.name}</p>
        </div>
        {isCompanyAdmin && tab === 'documents' && (
          <Button onClick={() => setNewDocOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
            <Plus size={16} />Uusi dokumentti
          </Button>
        )}
        {isCompanyAdmin && tab === 'files' && (
          <>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => handleFileUpload(e.target.files)} />
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white text-black hover:bg-neutral-100 gap-2">
              <Upload size={16} />{uploading ? 'Ladataan...' : 'Lisää tiedostoja'}
            </Button>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-neutral-800/40 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${tab === 'documents' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          <FileText size={14} />Dokumentit ({documents?.length ?? 0})
        </button>
        <button
          onClick={() => setTab('files')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${tab === 'files' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'}`}
        >
          <Files size={14} />Muut tiedostot ({otherFiles?.length ?? 0})
        </button>
      </div>

      {/* Documents tab */}
      {tab === 'documents' && (
        <>
          {docsLoading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-neutral-800/30 rounded-xl animate-pulse" />)}</div>
          ) : documents?.length === 0 ? (
            <EmptyState icon={FileText} title="Ei dokumentteja" sub="Luo uusi dokumentti mallipohjan avulla" action={isCompanyAdmin ? () => setNewDocOpen(true) : undefined} actionLabel="Luo dokumentti" />
          ) : (
            <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
              {documents?.map((doc, i) => {
                const cat = CATEGORY_LABELS[doc.category] ?? CATEGORY_LABELS.general;
                return (
                  <div key={doc.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-neutral-800/40 transition-colors ${i < documents.length - 1 ? 'border-b border-neutral-800' : ''}`}>
                    <div className="w-8 h-8 bg-neutral-700/50 rounded flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-neutral-400" />
                    </div>
                    <Link to={`/documents/${doc.id}`} className="flex-1 min-w-0 group">
                      <div className="text-white text-sm font-medium group-hover:underline truncate">{doc.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs ${cat.color}`}>{cat.label}</span>
                        <span className="text-neutral-700 text-xs">·</span>
                        <span className="text-neutral-600 text-xs">
                          {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true, locale: fi })}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        doc.status === 'published'
                          ? 'bg-green-950/50 text-green-400 border border-green-800/50'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                      }`}>
                        {doc.status === 'published' ? 'Julkaistu' : 'Luonnos'}
                      </span>
                      {isCompanyAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded text-neutral-600 hover:text-white hover:bg-neutral-700 transition-colors">
                              <MoreHorizontal size={15} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white" align="end">
                            <DropdownMenuItem asChild className="gap-2 hover:bg-neutral-700 cursor-pointer">
                              <Link to={`/documents/${doc.id}`}><Pencil size={14} />Muokkaa</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 hover:bg-neutral-700 cursor-pointer text-red-400" onClick={() => deleteDocument(doc.id)}>
                              <Trash2 size={14} />Poista
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Files tab */}
      {tab === 'files' && (
        <>
          {/* Drag & drop zone */}
          {isCompanyAdmin && (
            <div
              className="border-2 border-dashed border-neutral-700 hover:border-neutral-600 rounded-xl p-8 mb-6 text-center cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
            >
              <Upload size={24} className="text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm">Raahaa tiedostoja tähän tai <span className="text-white">selaa</span></p>
              <p className="text-neutral-600 text-xs mt-1">PDF, Word, Excel, kuvat — max 50 MB</p>
            </div>
          )}

          {filesLoading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-neutral-800/30 rounded-xl animate-pulse" />)}</div>
          ) : otherFiles?.length === 0 ? (
            <EmptyState icon={Files} title="Ei tiedostoja" sub="Lisää tiedostoja drag & drop tai nappulalla" action={isCompanyAdmin ? () => fileInputRef.current?.click() : undefined} actionLabel="Lisää tiedostoja" />
          ) : (
            <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
              {otherFiles?.map((asset, i) => (
                <div key={asset.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < otherFiles.length - 1 ? 'border-b border-neutral-800' : ''}`}>
                  <div className="w-8 h-8 bg-neutral-700/50 rounded flex items-center justify-center shrink-0">
                    <FileIconSmall mime={asset.mime_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{asset.name}</div>
                    <div className="text-neutral-500 text-xs">
                      {asset.asset_folders?.name ?? 'Ei kansiota'} · {formatSize(asset.file_size)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => downloadAsset(asset)} className="p-1.5 rounded text-neutral-500 hover:text-white hover:bg-neutral-700 transition-colors" title="Lataa">
                      <Download size={14} />
                    </button>
                    {isCompanyAdmin && (
                      <button onClick={() => deleteAsset(asset)} className="p-1.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors" title="Poista">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <NewDocumentDialog
        open={newDocOpen}
        onClose={() => setNewDocOpen(false)}
        onCreated={(id) => { setNewDocOpen(false); navigate(`/documents/${id}`); }}
        companyId={activeCompany?.id ?? ''}
        companyName={activeCompany?.name ?? ''}
        userId={user?.id ?? ''}
      />
    </div>
  );
}

function NewDocumentDialog({
  open, onClose, onCreated, companyId, companyName, userId
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
  companyId: string;
  companyName: string;
  userId: string;
}) {
  const [step, setStep] = useState<'template' | 'name'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ['document-templates', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_templates')
        .select('*')
        .or(`is_global.eq.true,company_id.eq.${companyId}`)
        .order('sort_order');
      return (data ?? []) as Template[];
    },
    enabled: !!companyId && open,
  });

  async function create() {
    if (!title.trim() || !companyId) return;
    setCreating(true);

    // Replace template placeholders recursively through JSON tree
    const replacements: Record<string, string> = {
      company_name: companyName,
      date: new Date().toLocaleDateString('fi-FI'),
    };
    function replaceInJson(obj: unknown): unknown {
      if (typeof obj === 'string') {
        return Object.entries(replacements).reduce(
          (s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v), obj
        );
      }
      if (Array.isArray(obj)) return obj.map(replaceInJson);
      if (obj && typeof obj === 'object') {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, replaceInJson(v)]));
      }
      return obj;
    }
    let content = replaceInJson(
      selectedTemplate?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] }
    );

    const { data, error } = await supabase.from('documents').insert({
      company_id: companyId,
      title: title.trim(),
      category: (selectedTemplate?.category ?? 'general') as any,
      content: content as Json,
      template_id: selectedTemplate?.id ?? null,
      created_by: userId,
    }).select().single();

    if (!error && data) onCreated(data.id);
    else toast.error('Luominen epäonnistui');
    setCreating(false);
  }

  function reset() { setStep('template'); setSelectedTemplate(null); setTitle(''); }

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); reset(); }}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <FileText size={18} />
            {step === 'template' ? 'Valitse mallipohja' : 'Nimeä dokumentti'}
          </DialogTitle>
        </DialogHeader>

        {step === 'template' ? (
          <div className="space-y-2 mt-2 max-h-96 overflow-y-auto">
            {templates?.map(t => {
              const cat = CATEGORY_LABELS[t.category] ?? CATEGORY_LABELS.general;
              return (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t); setTitle(t.name); setStep('name'); }}
                  className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800/50 transition-colors text-left"
                >
                  <FileText size={18} className="text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-medium">{t.name}</div>
                    {t.description && <div className="text-neutral-500 text-xs mt-0.5">{t.description}</div>}
                    <span className={`text-xs mt-1 inline-block ${cat.color}`}>{cat.label}</span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => { setSelectedTemplate(null); setTitle('Uusi dokumentti'); setStep('name'); }}
              className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border border-dashed border-neutral-700 hover:border-neutral-500 transition-colors text-left"
            >
              <Plus size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-neutral-300 text-sm font-medium">Tyhjä dokumentti</div>
                <div className="text-neutral-600 text-xs mt-0.5">Aloita puhtaalta pöydältä</div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {selectedTemplate && (
              <div className="bg-neutral-800/50 rounded-lg px-4 py-3 text-sm text-neutral-400">
                Pohja: <span className="text-white">{selectedTemplate.name}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-neutral-300 text-sm">Dokumentin nimi</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') create(); }}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('template')} className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">
                Takaisin
              </Button>
              <Button onClick={create} disabled={creating || !title.trim()} className="flex-1 bg-white text-black hover:bg-neutral-100">
                {creating ? 'Luodaan...' : 'Luo ja avaa'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EmptyState({ icon: Icon, title, sub, action, actionLabel }: {
  icon: React.ElementType; title: string; sub: string; action?: () => void; actionLabel?: string;
}) {
  return (
    <div className="text-center py-16 text-neutral-600">
      <Icon size={32} className="mx-auto mb-3 opacity-40" />
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="text-xs mt-1">{sub}</p>
      {action && <Button onClick={action} size="sm" className="mt-4 bg-white text-black hover:bg-neutral-100">{actionLabel}</Button>}
    </div>
  );
}

function FileIconSmall({ mime }: { mime: string | null }) {
  if (mime?.startsWith('image/')) return <FileImage size={15} className="text-blue-400" />;
  if (mime === 'application/pdf') return <FileText size={15} className="text-red-400" />;
  return <File size={15} className="text-neutral-400" />;
}

function formatSize(bytes: number) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
