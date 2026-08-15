import { useMemo, useCallback } from 'react';
import ar from './ar';
import en from './en';
import { useSettings } from '../state/SettingsContext';

export const LANGUAGES = {
  ar: { dict: ar, dir: 'rtl', label: 'العربية' },
  en: { dict: en, dir: 'ltr', label: 'English' },
};

export const DEFAULT_LANGUAGE = 'ar';

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict);
}

// Central translation hook. Every user-facing string in the app should be
// read through this — never hard-coded per-component. `t('checkin.title')`
// returns the string for the active language, falling back to Arabic (the
// default language) and finally to the key itself so a missing translation
// never crashes the UI, it just becomes visibly obvious in review.
export function useTranslation() {
  const { settings } = useSettings();
  const lang = LANGUAGES[settings.language] ? settings.language : DEFAULT_LANGUAGE;
  const dict = LANGUAGES[lang].dict;

  const t = useCallback(
    (key, vars) => {
      let str = resolve(dict, key);
      if (str === undefined) str = resolve(LANGUAGES[DEFAULT_LANGUAGE].dict, key);
      if (str === undefined) return key;
      if (vars) {
        Object.keys(vars).forEach((k) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
        });
      }
      return str;
    },
    [dict]
  );

  return useMemo(
    () => ({ t, lang, dir: LANGUAGES[lang].dir, languages: LANGUAGES }),
    [t, lang]
  );
}
