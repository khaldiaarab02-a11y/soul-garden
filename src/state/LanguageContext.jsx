import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/*
  LanguageContext
  ================
  Owns the app's language + text direction. Arabic/RTL is the default,
  matching index.html. This provider keeps <html lang>/<html dir> in
  sync with state so that switching languages later (TASK 002+) is a
  single state change, not a per-component concern.

  Deliberately minimal for TASK 001: no translation dictionary yet,
  just the language/direction primitive that journeys and UI copy
  will build on.
*/

const LanguageContext = createContext(null);

const DIRECTIONS = {
  ar: 'rtl',
  en: 'ltr',
};

export function LanguageProvider({ children, initialLanguage = 'ar' }) {
  const [language, setLanguage] = useState(initialLanguage);

  const direction = DIRECTIONS[language] ?? 'rtl';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const value = useMemo(
    () => ({ language, direction, setLanguage }),
    [language, direction]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
