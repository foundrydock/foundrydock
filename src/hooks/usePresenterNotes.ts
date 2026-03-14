import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PresenterNote {
  id: string;
  slideId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DEBOUNCE_MS = 500;

export function usePresenterNotes(slideId: string | null) {
  const [note, setNote] = useState<PresenterNote | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pendingContentRef = useRef<string | null>(null);
  const noteIdRef = useRef<string | null>(null);

  const fetchNote = useCallback(async () => {
    if (!slideId) {
      setNote(null);
      setContent('');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await (supabase
        .from('presenter_notes' as any)
        .select('*')
        .eq('slide_id', slideId)
        .maybeSingle() as any);

      if (error) throw error;

      if (data) {
        const fetchedNote = {
          id: data.id,
          slideId: data.slide_id,
          content: data.content,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setNote(fetchedNote);
        setContent(data.content);
        noteIdRef.current = data.id;
      } else {
        setNote(null);
        setContent('');
        noteIdRef.current = null;
      }
    } catch (err) {
      console.error('Failed to fetch presenter note:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchNote();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchNote]);

  const persistNote = useCallback(async (contentToSave: string) => {
    if (!slideId) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      if (noteIdRef.current) {
        const { error } = await (supabase
          .from('presenter_notes' as any)
          .update({ content: contentToSave } as any)
          .eq('id', noteIdRef.current) as any);

        if (error) throw error;
      } else {
        const { data, error } = await (supabase
          .from('presenter_notes' as any)
          .insert({
            slide_id: slideId,
            content: contentToSave,
          } as any)
          .select()
          .single() as any);

        if (error) throw error;
        
        if (data) {
          noteIdRef.current = data.id;
          setNote({
            id: data.id,
            slideId: data.slide_id,
            content: data.content,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save presenter note:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, [slideId]);

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    pendingContentRef.current = newContent;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (pendingContentRef.current !== null) {
        persistNote(pendingContentRef.current);
        pendingContentRef.current = null;
      }
    }, DEBOUNCE_MS);
  }, [persistNote]);

  const deleteNote = async (): Promise<boolean> => {
    if (!noteIdRef.current) return false;

    try {
      const { error } = await (supabase
        .from('presenter_notes' as any)
        .delete()
        .eq('id', noteIdRef.current) as any);

      if (error) throw error;

      setNote(null);
      setContent('');
      noteIdRef.current = null;
      return true;
    } catch (err) {
      console.error('Failed to delete presenter note:', err);
      return false;
    }
  };

  return {
    note,
    content,
    loading,
    saving,
    saveStatus,
    updateContent,
    deleteNote,
    refetch: fetchNote,
  };
}
