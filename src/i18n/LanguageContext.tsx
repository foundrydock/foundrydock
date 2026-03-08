import React, { createContext, useContext, useState, useCallback } from 'react';
import { fi } from './translations/fi';
import { en } from './translations/en';

export type Language = 'fi' | 'en';
// Future: | 'sv' | 'no'

type Translations = Record<string, string>;

const translationMap: Record<Language, Translations> = { fi, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fi');

  const t = useCallback((key: string) => {
    return translationMap[language]?.[key] || translationMap['fi']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
