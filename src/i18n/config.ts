export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'ar'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const RTL_LOCALES: SupportedLocale[] = ['ar'];

export function isSupported(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
