import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fi } from './translations/fi';
import { en } from './translations/en';

export type Language = 'fi' | 'en';

type Translations = Record<string, string>;
type Overrides = Record<Language, Record<string, string>>;

const translationMap: Record<Language, Translations> = { fi, en };

function loadOverrides(storageKey: string): Overrides {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { fi: {}, en: {} };
  } catch { return { fi: {}, en: {} }; }
}

function saveOverrides(storageKey: string, overrides: Overrides) {
  localStorage.setItem(storageKey, JSON.stringify(overrides));
}

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
  const [overrides, setOverrides] = useState<Overrides>(() => loadOverrides(overridesKey));

  // Reload overrides when key changes (deck switch)
  useEffect(() => {
    setOverrides(loadOverrides(overridesKey));
  }, [overridesKey]);

  useEffect(() => { saveOverrides(overridesKey, overrides); }, [overridesKey, overrides]);

  const t = useCallback((key: string) => {
    return overrides[language]?.[key] || translationMap[language]?.[key] || translationMap['fi']?.[key] || key;
  }, [language, overrides]);

  const updateTranslation = useCallback((key: string, value: string) => {
    setOverrides(prev => ({
      ...prev,
      [language]: { ...prev[language], [key]: value },
    }));
  }, [language]);

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
