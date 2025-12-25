import { describe, expect, it } from 'vitest';
import { getRandomReason, getReasons, parseAcceptLanguage, resolveLocale } from './index';

describe('resolveLocale', () => {
  it('returns requested locale if supported', () => {
    expect(resolveLocale('es')).toBe('es');
    expect(resolveLocale('fr')).toBe('fr');
    expect(resolveLocale('ar')).toBe('ar');
    expect(resolveLocale('en')).toBe('en');
  });

  it('returns default for unsupported locale', () => {
    expect(resolveLocale('zz')).toBe('en');
    expect(resolveLocale('de')).toBe('en');
    expect(resolveLocale('ja')).toBe('en');
  });

  it('returns default for null', () => {
    expect(resolveLocale(null)).toBe('en');
  });
});

describe('parseAcceptLanguage', () => {
  it('picks best supported match', () => {
    expect(parseAcceptLanguage('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    expect(parseAcceptLanguage('fr-FR,fr;q=0.9')).toBe('fr');
    expect(parseAcceptLanguage('ar-SA,ar;q=0.9,en;q=0.8')).toBe('ar');
  });

  it('falls back to en if no match', () => {
    expect(parseAcceptLanguage('de-DE,de;q=0.9')).toBe('en');
    expect(parseAcceptLanguage('ja-JP,ja;q=0.9')).toBe('en');
  });

  it('handles null header', () => {
    expect(parseAcceptLanguage(null)).toBe('en');
  });

  it('respects quality values', () => {
    // German first but not supported, Spanish second
    expect(parseAcceptLanguage('de;q=0.9,es;q=0.8')).toBe('es');
    // French has higher quality than Spanish
    expect(parseAcceptLanguage('es;q=0.7,fr;q=0.9')).toBe('fr');
  });

  it('handles simple language codes', () => {
    expect(parseAcceptLanguage('es')).toBe('es');
    expect(parseAcceptLanguage('fr')).toBe('fr');
  });
});

describe('getReasons', () => {
  it('returns array for each supported locale', () => {
    expect(getReasons('en').length).toBeGreaterThan(0);
    expect(getReasons('es').length).toBeGreaterThan(0);
    expect(getReasons('fr').length).toBeGreaterThan(0);
    expect(getReasons('ar').length).toBeGreaterThan(0);
  });

  it('all locales have same count as English', () => {
    const enCount = getReasons('en').length;
    expect(getReasons('es').length).toBe(enCount);
    expect(getReasons('fr').length).toBe(enCount);
    expect(getReasons('ar').length).toBe(enCount);
  });
});

describe('getRandomReason', () => {
  it('returns a string for each locale', () => {
    expect(typeof getRandomReason('en')).toBe('string');
    expect(typeof getRandomReason('es')).toBe('string');
    expect(typeof getRandomReason('fr')).toBe('string');
    expect(typeof getRandomReason('ar')).toBe('string');
  });

  it('returns non-empty strings', () => {
    expect(getRandomReason('en').length).toBeGreaterThan(0);
    expect(getRandomReason('es').length).toBeGreaterThan(0);
  });
});
