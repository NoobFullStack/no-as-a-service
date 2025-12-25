#!/usr/bin/env npx tsx
/**
 * Scaffolds a new locale file from English.
 * Usage: npm run i18n:new-locale -- --lang=de
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, '../../src/i18n');

const langArg = process.argv.find((arg) => arg.startsWith('--lang='));
if (!langArg) {
  console.error('Usage: npm run i18n:new-locale -- --lang=XX');
  process.exit(1);
}

const newLocale = langArg.split('=')[1].toLowerCase();

if (!/^[a-z]{2}$/.test(newLocale)) {
  console.error('Locale must be a 2-letter ISO code (e.g., de, ja, zh)');
  process.exit(1);
}

const targetDir = join(I18N_DIR, newLocale);
const targetFile = join(targetDir, 'reasons.json');

if (existsSync(targetFile)) {
  console.error(`Locale "${newLocale}" already exists at ${targetFile}`);
  process.exit(1);
}

// Load English reasons
const enPath = join(I18N_DIR, 'en/reasons.json');
const enReasons: string[] = JSON.parse(readFileSync(enPath, 'utf-8'));

// Create template with TODO markers
const template = enReasons.map((reason) => `[TODO:${newLocale.toUpperCase()}] ${reason}`);

mkdirSync(targetDir, { recursive: true });
writeFileSync(targetFile, JSON.stringify(template, null, 2) + '\n');

console.log(`✅ Created ${targetFile}`);
console.log(`   ${enReasons.length} entries marked with [TODO:${newLocale.toUpperCase()}]`);
console.log(`\nNext steps:`);
console.log(`1. Translate entries in ${targetFile}`);
console.log(`2. Remove [TODO:XX] markers as you translate`);
console.log(`3. Add "${newLocale}" to SUPPORTED_LOCALES in src/i18n/config.ts`);
console.log(`4. Run: npm run i18n:validate`);
