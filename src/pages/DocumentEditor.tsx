import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/auth/CompanyContext';
import { Tables, Json } from '@/integrations/supabase/types';
import RichEditor from '@/components/documents/RichEditor';
import ShareDialog from '@/components/library/ShareDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Save, Share2, Eye, EyeOff, Printer, Check, Clock
} from 'lucide-react';
import { toast } from 'sonner';

type Document = Tables<'documents'>;

const CATEGORY_LABELS: Record<string, string> = {
  board_minutes: 'Hallituksen pöytäkirja',
  contract: 'Sopimus',
  nda: 'Salassapitosopimus',
  brand_guidelines: 'Brand Guidelines',
  general: 'Yleinen dokumentti',
  other: 'Muu',
};

export default function DocumentEditor() {
  const { docId } = useParams<{ docId: string }>();
  const { activeCompany, isCompanyAdmin } = useCompany();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Json>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [shareOpen, setShareOpen] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', docId],
    queryFn: async () => {
      const { data } = await supabase.from('documents').select('*').eq('id', docId!).single();
      return data as Document;
    },
    enabled: !!docId,
  });

  const { data: brand } = useQuery({
    queryKey: ['brand', activeCompany?.id],
    queryFn: async () => {
      const { data } = await supabase.from('brand_settings').select('*').eq('company_id', activeCompany!.id).single();
      return data;
    },
    enabled: !!activeCompany?.id,
  });

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setContent(doc.content);
    }
  }, [doc]);

  const save = useCallback(async (titleVal: string, contentVal: Json, showToast = false) => {
    if (!docId) return;
    setSaving(true);
    setSaveStatus('saving');
    const { error } = await supabase
      .from('documents')
      .update({ title: titleVal, content: contentVal, updated_at: new Date().toISOString() })
      .eq('id', docId);
    setSaving(false);
    if (error) {
      setSaveStatus('unsaved');
      if (showToast) toast.error('Tallennus epäonnistui');
    } else {
      setSaveStatus('saved');
      if (showToast) toast.success('Tallennettu');
      qc.invalidateQueries({ queryKey: ['documents'] });
    }
  }, [docId, qc]);

  function handleContentChange(newContent: Json) {
    setContent(newContent);
    setSaveStatus('unsaved');
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const t = setTimeout(() => save(title, newContent), 2000);
    setAutoSaveTimer(t);
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setSaveStatus('unsaved');
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const t = setTimeout(() => save(newTitle, content), 2000);
    setAutoSaveTimer(t);
  }

  async function togglePublish() {
    if (!doc) return;
    const newStatus = doc.status === 'published' ? 'draft' : 'published';
    await supabase.from('documents').update({ status: newStatus }).eq('id', doc.id);
    qc.invalidateQueries({ queryKey: ['document', docId] });
    qc.invalidateQueries({ queryKey: ['documents'] });
    toast.success(newStatus === 'published' ? 'Julkaistu' : 'Palautettu luonnokseksi');
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-neutral-900">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-800 bg-neutral-950 print:hidden">
        <Link to="/documents" className="text-neutral-500 hover:text-white transition-colors shrink-0">
          <ArrowLeft size={18} />
        </Link>

        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            className="bg-transparent text-white font-medium text-base w-full outline-none placeholder:text-neutral-600 min-w-0"
            placeholder="Dokumentin nimi"
            disabled={!isCompanyAdmin}
          />
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-neutral-600 text-xs">{CATEGORY_LABELS[doc?.category ?? 'general']}</span>
            <span className="text-neutral-700 text-xs">·</span>
            <span className={`text-xs flex items-center gap-1 ${
              saveStatus === 'saved' ? 'text-neutral-600'
              : saveStatus === 'saving' ? 'text-yellow-500'
              : 'text-orange-400'
            }`}>
              {saveStatus === 'saved' ? <><Check size={10} />Tallennettu</> : saveStatus === 'saving' ? <><Clock size={10} />Tallennetaan...</> : <><Clock size={10} />Tallentamaton</>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            doc?.status === 'published'
              ? 'bg-green-950/50 text-green-400 border border-green-800/50'
              : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
          }`}>
            {doc?.status === 'published' ? 'Julkaistu' : 'Luonnos'}
          </span>

          {isCompanyAdmin && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => save(title, content, true)}
                disabled={saving}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 h-8"
              >
                <Save size={14} className="mr-1.5" />
                Tallenna
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={togglePublish}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 h-8"
              >
                {doc?.status === 'published' ? <><EyeOff size={14} className="mr-1.5" />Luonnos</> : <><Eye size={14} className="mr-1.5" />Julkaise</>}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShareOpen(true)}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 h-8"
              >
                <Share2 size={14} className="mr-1.5" />
                Jaa
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 h-8"
            title="Tulosta / Tallenna PDF"
          >
            <Printer size={14} />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <RichEditor
          content={content}
          onChange={isCompanyAdmin ? handleContentChange : undefined}
          readOnly={!isCompanyAdmin}
          brandColors={brand ? { primary: brand.primary_color, accent: brand.accent_color } : undefined}
        />
      </div>

      {doc && (
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          target={{ type: 'asset', id: doc.id, name: doc.title }}
        />
      )}
    </div>
  );
}
