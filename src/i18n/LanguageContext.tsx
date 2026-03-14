import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { fi } from './translations/fi';
import { en } from './translations/en';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'fi' | 'en';

type Translations = Record<string, string>;
type Overrides = Record<Language, Record<string, string>>;

const translationMap: Record<Language, Translations> = { fi, en };

const DEBOUNCE_MS = 300;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  updateTranslation: (key: string, value: string) => void;
  overridesKey: string;
  setOverridesKey: (key: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fi');
  const [editMode, setEditMode] = useState(false);
  const [overridesKey, setOverridesKey] = useState('slide-translation-overrides');
  const [overrides, setOverrides] = useState<Overrides>({ fi: {}, en: {} });
  const pendingSaves = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load overrides from Supabase
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('content_overrides')
        .select('language, translation_key, value')
        .eq('deck_key', overridesKey);

      if (error) {
        console.error('Failed to load overrides:', error);
        return;
      }

      const loaded: Overrides = { fi: {}, en: {} };
      data?.forEach((row: any) => {
        const lang = row.language as Language;
        if (loaded[lang]) {
          loaded[lang][row.translation_key] = row.value;
        }
      });
      setOverrides(loaded);
    }
    load();
  }, [overridesKey]);

  const t = useCallback((key: string) => {
    return overrides[language]?.[key] || translationMap[language]?.[key] || translationMap['fi']?.[key] || key;
  }, [language, overrides]);

  const updateTranslation = useCallback((key: string, value: string) => {
    // Optimistic update
    setOverrides(prev => ({
      ...prev,
      [language]: { ...prev[language], [key]: value },
    }));

    // Debounced save to Supabase
    const mapKey = `${language}:${key}`;
    const existing = pendingSaves.current.get(mapKey);
    if (existing) clearTimeout(existing);

    pendingSaves.current.set(mapKey, setTimeout(async () => {
      pendingSaves.current.delete(mapKey);
      const { error } = await supabase
        .from('content_overrides')
        .upsert({
          deck_key: overridesKey,
          language,
          translation_key: key,
          value,
        }, { onConflict: 'deck_key,language,translation_key' });

      if (error) console.error('Failed to save override:', error);
    }, DEBOUNCE_MS));
  }, [language, overridesKey]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, editMode, setEditMode, updateTranslation, overridesKey, setOverridesKey }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
