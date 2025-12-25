#!/usr/bin/env npx tsx
/**
 * Validates all locale files have the same number of entries as English.
 * Usage: npm run i18n:validate
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, '../../src/i18n');
const LOCALES = ['en', 'es', 'fr', 'ar'];

interface ValidationResult {
  locale: string;
  count: number;
  status: 'ok' | 'missing' | 'mismatch';
  message?: string;
}

function validate(): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Load English as baseline
  const enPath = join(I18N_DIR, 'en/reasons.json');
  const enReasons: string[] = JSON.parse(readFileSync(enPath, 'utf-8'));
  const expectedCount = enReasons.length;

  results.push({ locale: 'en', count: expectedCount, status: 'ok' });

  for (const locale of LOCALES.filter((l) => l !== 'en')) {
    const path = join(I18N_DIR, `${locale}/reasons.json`);

    if (!existsSync(path)) {
      results.push({
        locale,
        count: 0,
        status: 'missing',
        message: `File not found: ${path}`,
      });
      continue;
    }

    const reasons: string[] = JSON.parse(readFileSync(path, 'utf-8'));

    if (reasons.length !== expectedCount) {
      results.push({
        locale,
        count: reasons.length,
        status: 'mismatch',
        message: `Expected ${expectedCount} entries, found ${reasons.length}`,
      });
    } else {
      results.push({ locale, count: reasons.length, status: 'ok' });
    }
  }

  return results;
}

const results = validate();
let hasErrors = false;

console.log('\n📋 i18n Validation Report\n');
console.log('| Locale | Count | Status |');
console.log('|--------|-------|--------|');

for (const r of results) {
  const statusIcon = r.status === 'ok' ? '✅' : '❌';
  console.log(`| ${r.locale.padEnd(6)} | ${String(r.count).padEnd(5)} | ${statusIcon} ${r.status} |`);
  if (r.status !== 'ok') {
    hasErrors = true;
    console.log(`         └─ ${r.message}`);
  }
}

console.log('');

if (hasErrors) {
  console.log('❌ Validation failed!\n');
  process.exit(1);
} else {
  console.log('✅ All locales valid!\n');
  process.exit(0);
}
