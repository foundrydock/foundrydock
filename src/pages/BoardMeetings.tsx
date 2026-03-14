import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { useCompany } from '@/auth/CompanyContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarDays, Plus, MoreHorizontal, Trash2, ChevronRight, MapPin, Users } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { fi } from 'date-fns/locale';

type BoardMeeting = Tables<'board_meetings'>;

const STATUS_CONFIG = {
  draft:     { label: 'Luonnos',   color: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
  published: { label: 'Julkaistu', color: 'bg-green-950/50 text-green-400 border-green-800/50' },
  archived:  { label: 'Arkistoitu',color: 'bg-neutral-800/50 text-neutral-600 border-neutral-700' },
};

export default function BoardMeetings() {
  const { user } = useAuth();
  const { activeCompany, isCompanyAdmin } = useCompany();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [newOpen, setNewOpen] = useState(false);

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['board-meetings', activeCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('board_meetings')
        .select('*')
        .eq('company_id', activeCompany!.id)
        .order('meeting_date', { ascending: false });
      return (data ?? []) as BoardMeeting[];
    },
    enabled: !!activeCompany?.id,
  });

  async function deleteMeeting(id: string) {
    if (!confirm('Poistetaanko kokous? Kaikki liittyvät dokumentit säilyvät.')) return;
    await supabase.from('board_meetings').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['board-meetings', activeCompany?.id] });
    toast.success('Kokous poistettu');
  }

  // Group by year
  const byYear = (meetings ?? []).reduce<Record<string, BoardMeeting[]>>((acc, m) => {
    const y = m.meeting_date.substring(0, 4);
    if (!acc[y]) acc[y] = [];
    acc[y].push(m);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => +b - +a);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hallituksen kokoukset</h1>
          <p className="text-neutral-500 text-sm mt-1">{activeCompany?.name}</p>
        </div>
        {isCompanyAdmin && (
          <Button onClick={() => setNewOpen(true)} className="bg-white text-black hover:bg-neutral-100 gap-2">
            <Plus size={16} />Uusi kokous
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-neutral-800/30 rounded-xl animate-pulse" />)}</div>
      ) : meetings?.length === 0 ? (
        <div className="text-center py-16 text-neutral-600">
          <CalendarDays size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm text-neutral-500">Ei kokouksia vielä</p>
          {isCompanyAdmin && (
            <Button onClick={() => setNewOpen(true)} size="sm" className="mt-4 bg-white text-black hover:bg-neutral-100">
              Luo ensimmäinen kokous
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {years.map(year => (
            <div key={year}>
              <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-3">{year}</div>
              <div className="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden">
                {byYear[year].map((meeting, i) => {
                  const status = STATUS_CONFIG[meeting.status];
                  const attendees = Array.isArray(meeting.attendees) ? meeting.attendees as string[] : [];
                  return (
                    <div
                      key={meeting.id}
                      className={`group flex items-center gap-4 px-5 py-4 hover:bg-neutral-800/40 transition-colors cursor-pointer ${i < byYear[year].length - 1 ? 'border-b border-neutral-800' : ''}`}
                      onClick={() => navigate(`/board/${meeting.id}`)}
                    >
                      {/* Date block */}
                      <div className="w-12 text-center shrink-0">
                        <div className="text-white text-xl font-bold leading-none">
                          {format(parseISO(meeting.meeting_date), 'd')}
                        </div>
                        <div className="text-neutral-500 text-xs uppercase">
                          {format(parseISO(meeting.meeting_date), 'MMM', { locale: fi })}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium">{meeting.title}</div>
                        <div className="flex items-center gap-3 mt-1">
                          {meeting.location && (
                            <span className="flex items-center gap-1 text-neutral-500 text-xs">
                              <MapPin size={11} />{meeting.location}
                            </span>
                          )}
                          {attendees.length > 0 && (
                            <span className="flex items-center gap-1 text-neutral-500 text-xs">
                              <Users size={11} />{attendees.length} osallistujaa
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                        {isCompanyAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="p-1.5 rounded text-neutral-600 hover:text-white hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={e => e.stopPropagation()}
                              >
                                <MoreHorizontal size={15} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white" align="end">
                              <DropdownMenuItem
                                className="gap-2 hover:bg-neutral-700 cursor-pointer text-red-400"
                                onClick={e => { e.stopPropagation(); deleteMeeting(meeting.id); }}
                              >
                                <Trash2 size={14} />Poista
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                        <ChevronRight size={15} className="text-neutral-700 group-hover:text-neutral-500 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewMeetingDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreated={(id) => { setNewOpen(false); navigate(`/board/${id}`); }}
        companyId={activeCompany?.id ?? ''}
        userId={user?.id ?? ''}
      />
    </div>
  );
}

function NewMeetingDialog({ open, onClose, onCreated, companyId, userId }: {
  open: boolean; onClose: () => void; onCreated: (id: string) => void;
  companyId: string; userId: string;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!title.trim() || !date) return;
    setSaving(true);
    const { data, error } = await supabase.from('board_meetings').insert({
      company_id: companyId,
      title: title.trim(),
      meeting_date: date,
      location: location || null,
      created_by: userId,
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
            <CalendarDays size={18} />Uusi hallituksen kokous
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Kokouksen otsikko</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="esim. Hallituksen kokous 1/2026" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Päivämäärä</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-neutral-800 border-neutral-700 text-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-neutral-300 text-sm">Paikka (valinnainen)</Label>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="esim. Toimisto, Helsinki" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">Peruuta</Button>
            <Button onClick={create} disabled={saving || !title.trim() || !date} className="flex-1 bg-white text-black hover:bg-neutral-100">
              {saving ? 'Luodaan...' : 'Luo kokous'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
