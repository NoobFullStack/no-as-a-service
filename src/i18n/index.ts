import arReasons from './ar/reasons.json';
import {
    DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    isSupported,
    type SupportedLocale,
} from './config';
import enReasons from './en/reasons.json';
import esReasons from './es/reasons.json';
import frReasons from './fr/reasons.json';

const reasonsByLocale: Record<SupportedLocale, string[]> = {
  en: enReasons,
  es: esReasons,
  fr: frReasons,
  ar: arReasons,
};

export function getReasons(locale: SupportedLocale): string[] {
  return reasonsByLocale[locale];
}

export function getRandomReason(locale: SupportedLocale): string {
  const reasons = getReasons(locale);
  return reasons[Math.floor(Math.random() * reasons.length)];
}

export function resolveLocale(requested: string | null): SupportedLocale {
  if (requested && isSupported(requested)) {
    return requested;
  }
  return DEFAULT_LOCALE;
}

export function parseAcceptLanguage(header: string | null): SupportedLocale {
  if (!header) return DEFAULT_LOCALE;

  // Parse Accept-Language header (e.g., "fr-FR,fr;q=0.9,en;q=0.8")
  const languages = header
    .split(',')
    .map((part) => {
      const [lang, qPart] = part.trim().split(';');
      const q = qPart ? parseFloat(qPart.split('=')[1]) : 1;
      // Extract base language (fr-FR -> fr)
      const baseLang = lang.split('-')[0].toLowerCase();
      return { lang: baseLang, q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (isSupported(lang)) {
      return lang;
    }
  }

  return DEFAULT_LOCALE;
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale };

