import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { Tables, Json } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';
import {
  ArrowLeft, CalendarDays, MapPin, Users, Plus, FileText,
  Pencil, Check, X, Trash2, ChevronRight, BookOpen
} from 'lucide-react';

type BoardMeeting = Tables<'board_meetings'>;
type Document = Tables<'documents'>;
type Template = Tables<'document_templates'>;

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Luonnos' },
  { value: 'published', label: 'Julkaistu' },
  { value: 'archived', label: 'Arkistoitu' },
] as const;

export default function BoardMeetingDetail() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const { user } = useAuth();
  const { activeCompany, isCompanyAdmin } = useCompany();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [newAttendee, setNewAttendee] = useState('');
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const { data: meeting, isLoading } = useQuery({
    queryKey: ['board-meeting', meetingId],
    queryFn: async () => {
      const { data } = await supabase.from('board_meetings').select('*').eq('id', meetingId!).single();
      return data as BoardMeeting;
    },
    enabled: !!meetingId,
  });

  const { data: minutesTemplates } = useQuery({
    queryKey: ['board-minutes-templates'],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_templates')
        .select('*')
        .eq('category', 'board_minutes')
        .eq('is_global', true)
        .order('sort_order');
      return (data ?? []) as Template[];
    },
  });

  const { data: documents } = useQuery({
    queryKey: ['board-meeting-docs', meetingId],
    queryFn: async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('board_meeting_id', meetingId!)
        .order('created_at');
      return (data ?? []) as Document[];
    },
    enabled: !!meetingId,
  });

  async function updateField(field: Partial<BoardMeeting>) {
    await supabase.from('board_meetings').update(field).eq('id', meetingId!);
    qc.invalidateQueries({ queryKey: ['board-meeting', meetingId] });
  }

  async function saveTitle() {
    if (!titleDraft.trim()) return;
    await updateField({ title: titleDraft.trim() });
    setEditingTitle(false);
    qc.invalidateQueries({ queryKey: ['board-meetings', activeCompany?.id] });
  }

  async function addAttendee() {
    if (!newAttendee.trim() || !meeting) return;
    const current = Array.isArray(meeting.attendees) ? meeting.attendees as string[] : [];
    await updateField({ attendees: [...current, newAttendee.trim()] as unknown as Json });
    setNewAttendee('');
  }

  async function removeAttendee(name: string) {
    if (!meeting) return;
    const current = Array.isArray(meeting.attendees) ? meeting.attendees as string[] : [];
    await updateField({ attendees: current.filter(a => a !== name) as unknown as Json });
  }

  async function addAgendaItem() {
    if (!newAgendaItem.trim() || !meeting) return;
    const current = Array.isArray(meeting.agenda) ? meeting.agenda as string[] : [];
    await updateField({ agenda: [...current, newAgendaItem.trim()] as unknown as Json });
    setNewAgendaItem('');
  }

  async function removeAgendaItem(item: string) {
    if (!meeting) return;
    const current = Array.isArray(meeting.agenda) ? meeting.agenda as string[] : [];
    await updateField({ agenda: current.filter(a => a !== item) as unknown as Json });
  }

  async function createDocumentFromTemplate(template: Template | null) {
    if (!meeting || !activeCompany) return;
    const replacements: Record<string, string> = {
      company_name: activeCompany.name,
      date: format(parseISO(meeting.meeting_date), 'd.M.yyyy'),
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
    const defaultContent = {
      type: 'doc', content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'HALLITUKSEN KOKOUS — PÖYTÄKIRJA' }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Yhtiö: ' }, { type: 'text', text: activeCompany.name }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Päivämäärä: ' }, { type: 'text', text: format(parseISO(meeting.meeting_date), 'd.M.yyyy') }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Paikka: ' }, { type: 'text', text: meeting.location ?? '' }] },
        { type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Läsnä: ' }, { type: 'text', text: (Array.isArray(meeting.attendees) ? (meeting.attendees as string[]).join(', ') : '') }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '§ 1  Kokouksen avaaminen' }] },
        { type: 'paragraph', content: [{ type: 'text', text: '' }] },
      ]
    };
    const content = replaceInJson(template?.content ?? defaultContent);
    const { data, error } = await supabase.from('documents').insert({
      company_id: activeCompany.id,
      board_meeting_id: meeting.id,
      title: template ? `${template.name} — ${format(parseISO(meeting.meeting_date), 'd.M.yyyy')}` : `Pöytäkirja — ${meeting.title}`,
      category: 'board_minutes',
      content: content as Json,
      template_id: template?.id ?? null,
      created_by: user?.id,
    }).select().single();
    if (!error && data) {
      qc.invalidateQueries({ queryKey: ['board-meeting-docs', meetingId] });
      setTemplatePickerOpen(false);
      navigate(`/documents/${data.id}`);
    } else {
      toast.error('Luominen epäonnistui');
    }
  }

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
    </div>
  );
  if (!meeting) return <div className="p-8 text-neutral-500">Kokousta ei löydy</div>;

  const attendees = Array.isArray(meeting.attendees) ? meeting.attendees as string[] : [];
  const agenda = Array.isArray(meeting.agenda) ? meeting.agenda as string[] : [];

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <Link to="/board" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm mb-6">
        <ArrowLeft size={16} />Hallituksen kokoukset
      </Link>

      {/* Title */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-1">
          {editingTitle && isCompanyAdmin ? (
            <div className="flex items-center gap-2">
              <Input
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
                className="bg-neutral-800 border-neutral-700 text-white text-xl font-semibold h-auto py-1"
                autoFocus
              />
              <button onClick={saveTitle} className="p-1.5 text-green-400 hover:bg-neutral-800 rounded"><Check size={16} /></button>
              <button onClick={() => setEditingTitle(false)} className="p-1.5 text-neutral-400 hover:bg-neutral-800 rounded"><X size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 className="text-2xl font-semibold text-white">{meeting.title}</h1>
              {isCompanyAdmin && (
                <button onClick={() => { setTitleDraft(meeting.title); setEditingTitle(true); }} className="p-1.5 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded opacity-0 group-hover:opacity-100 transition-all">
                  <Pencil size={14} />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-neutral-500 text-sm">
              <CalendarDays size={14} />
              {format(parseISO(meeting.meeting_date), 'd. MMMM yyyy', { locale: fi })}
            </span>
            {meeting.location && (
              <span className="flex items-center gap-1.5 text-neutral-500 text-sm">
                <MapPin size={14} />{meeting.location}
              </span>
            )}
          </div>
        </div>

        {isCompanyAdmin && (
          <select
            value={meeting.status}
            onChange={e => updateField({ status: e.target.value as any })}
            className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Osallistujat */}
        <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-neutral-400" />
            <h2 className="text-white text-sm font-medium">Osallistujat</h2>
          </div>
          <div className="space-y-2 mb-3">
            {attendees.length === 0 && <p className="text-neutral-600 text-xs">Ei osallistujia</p>}
            {attendees.map((a, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-neutral-300 text-sm">{a}</span>
                {isCompanyAdmin && (
                  <button onClick={() => removeAttendee(a)} className="p-1 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isCompanyAdmin && (
            <div className="flex gap-2">
              <Input
                value={newAttendee}
                onChange={e => setNewAttendee(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addAttendee(); }}
                placeholder="Lisää osallistuja"
                className="bg-neutral-900 border-neutral-700 text-white text-xs h-8 placeholder:text-neutral-600"
              />
              <Button size="sm" onClick={addAttendee} disabled={!newAttendee.trim()} className="h-8 w-8 p-0 bg-neutral-700 hover:bg-neutral-600">
                <Plus size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Esityslista */}
        <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-neutral-400" />
            <h2 className="text-white text-sm font-medium">Esityslista</h2>
          </div>
          <div className="space-y-2 mb-3">
            {agenda.length === 0 && <p className="text-neutral-600 text-xs">Ei asioita</p>}
            {agenda.map((item, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <span className="text-neutral-600 text-xs mt-0.5 w-4 shrink-0">{i + 1}.</span>
                <span className="text-neutral-300 text-sm flex-1">{item}</span>
                {isCompanyAdmin && (
                  <button onClick={() => removeAgendaItem(item)} className="p-1 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded shrink-0">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isCompanyAdmin && (
            <div className="flex gap-2">
              <Input
                value={newAgendaItem}
                onChange={e => setNewAgendaItem(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addAgendaItem(); }}
                placeholder="Lisää asia"
                className="bg-neutral-900 border-neutral-700 text-white text-xs h-8 placeholder:text-neutral-600"
              />
              <Button size="sm" onClick={addAgendaItem} disabled={!newAgendaItem.trim()} className="h-8 w-8 p-0 bg-neutral-700 hover:bg-neutral-600">
                <Plus size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Template picker dialog */}
      <Dialog open={templatePickerOpen} onOpenChange={setTemplatePickerOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <BookOpen size={18} />Valitse pöytäkirjapohja
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {minutesTemplates?.map(t => (
              <button
                key={t.id}
                onClick={() => createDocumentFromTemplate(t)}
                className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border border-neutral-700 hover:border-neutral-400 hover:bg-neutral-800/60 transition-colors text-left"
              >
                <FileText size={18} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  {t.description && <div className="text-neutral-500 text-xs mt-0.5">{t.description}</div>}
                </div>
              </button>
            ))}
            <button
              onClick={() => createDocumentFromTemplate(null)}
              className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border border-dashed border-neutral-700 hover:border-neutral-500 transition-colors text-left"
            >
              <Plus size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-neutral-300 text-sm font-medium">Tyhjä pöytäkirja</div>
                <div className="text-neutral-600 text-xs mt-0.5">Aloita puhtaalta pöydältä</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dokumentit */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-sm font-medium flex items-center gap-2">
            <FileText size={16} className="text-neutral-400" />
            Dokumentit
          </h2>
          {isCompanyAdmin && (
            <Button size="sm" onClick={() => setTemplatePickerOpen(true)} className="h-8 bg-white text-black hover:bg-neutral-100 gap-1.5">
              <Plus size={14} />Uusi pöytäkirja
            </Button>
          )}
        </div>

        {documents?.length === 0 ? (
          <div className="bg-neutral-800/20 border border-dashed border-neutral-800 rounded-xl p-8 text-center">
            <FileText size={24} className="mx-auto mb-2 text-neutral-700" />
            <p className="text-neutral-600 text-sm">Ei dokumentteja vielä</p>
            {isCompanyAdmin && (
              <Button size="sm" onClick={() => setTemplatePickerOpen(true)} className="mt-3 bg-white text-black hover:bg-neutral-100">
                Luo pöytäkirja
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
            {documents?.map((doc, i) => (
              <Link
                key={doc.id}
                to={`/documents/${doc.id}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-800/50 transition-colors ${i < (documents?.length ?? 0) - 1 ? 'border-b border-neutral-800' : ''}`}
              >
                <FileText size={16} className="text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{doc.title}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  doc.status === 'published' ? 'bg-green-950/50 text-green-400 border-green-800/50' : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }`}>
                  {doc.status === 'published' ? 'Julkaistu' : 'Luonnos'}
                </span>
                <ChevronRight size={14} className="text-neutral-700 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
