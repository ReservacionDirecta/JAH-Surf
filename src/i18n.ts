import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'es' | 'en';

export const USD_EXCHANGE_RATE = 3.5;

export function toUsd(soles: number): number {
  return Math.round(soles / USD_EXCHANGE_RATE);
}

export function formatDualPrice(soles: number): string {
  return `S/ ${soles} / $${toUsd(soles)} USD`;
}

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('es');

  const toggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, toggleLang } },
    children
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
