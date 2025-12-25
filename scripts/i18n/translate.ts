#!/usr/bin/env npx tsx
/**
 * Auto-translate reasons.json files using free Google Translate.
 * Includes rate limiting, exponential backoff, and progress saving.
 *
 * Usage:
 *   npm run i18n:translate -- --lang=es          # Translate to Spanish
 *   npm run i18n:translate -- --lang=es --resume # Resume interrupted translation
 *   npm run i18n:translate -- --lang=es --start=500 # Start from index 500
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import translate from 'google-translate-api-x';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, '../../src/i18n');

// Configuration
const BATCH_SIZE = 10; // Translate N items, then save
const DELAY_BETWEEN_REQUESTS_MS = 500; // Delay between individual translations
const DELAY_BETWEEN_BATCHES_MS = 2000; // Delay between batches
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

// Parse args
const args = process.argv.slice(2);
const langArg = args.find((a) => a.startsWith('--lang='));
const resumeFlag = args.includes('--resume');
const startArg = args.find((a) => a.startsWith('--start='));

if (!langArg) {
  console.error('Usage: npm run i18n:translate -- --lang=XX [--resume] [--start=N]');
  console.error('Available: es, fr, ar (or any ISO 639-1 code)');
  process.exit(1);
}

const targetLang = langArg.split('=')[1].toLowerCase();
const startIndex = startArg ? parseInt(startArg.split('=')[1], 10) : 0;

// File paths
const enPath = join(I18N_DIR, 'en/reasons.json');
const targetPath = join(I18N_DIR, `${targetLang}/reasons.json`);
const progressPath = join(I18N_DIR, `${targetLang}/.translate-progress.json`);

// Load English source
const enReasons: string[] = JSON.parse(readFileSync(enPath, 'utf-8'));
console.log(`📖 Loaded ${enReasons.length} English reasons`);

// Load or initialize target file
let targetReasons: string[];
if (existsSync(targetPath)) {
  targetReasons = JSON.parse(readFileSync(targetPath, 'utf-8'));
  console.log(`📂 Loaded existing ${targetLang} file with ${targetReasons.length} entries`);
} else {
  targetReasons = enReasons.map((r) => `[TODO:${targetLang.toUpperCase()}] ${r}`);
  console.log(`📝 Created new ${targetLang} template`);
}

// Load progress if resuming
interface Progress {
  lastIndex: number;
  completedCount: number;
}

let progress: Progress = { lastIndex: -1, completedCount: 0 };
if (resumeFlag && existsSync(progressPath)) {
  progress = JSON.parse(readFileSync(progressPath, 'utf-8'));
  console.log(`🔄 Resuming from index ${progress.lastIndex + 1} (${progress.completedCount} already done)`);
}

const effectiveStart = resumeFlag ? progress.lastIndex + 1 : startIndex;

// Helper: delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: translate with retry and exponential backoff
async function translateWithRetry(text: string, to: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await translate(text, { to, autoCorrect: false });
      return result.text;
    } catch (error: unknown) {
      lastError = error as Error;
      const statusCode = (error as { statusCode?: number }).statusCode;

      if (statusCode === 429) {
        const backoffMs = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
        console.log(`⚠️  Rate limited (429). Waiting ${backoffMs / 1000}s before retry ${attempt + 1}/${MAX_RETRIES}...`);
        await sleep(backoffMs);
      } else {
        console.error(`❌ Translation error: ${lastError.message}`);
        throw error;
      }
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries: ${lastError?.message}`);
}

// Save progress
function saveProgress(index: number, completed: number) {
  writeFileSync(progressPath, JSON.stringify({ lastIndex: index, completedCount: completed }, null, 2));
}

// Save target file
function saveTarget() {
  writeFileSync(targetPath, JSON.stringify(targetReasons, null, 2) + '\n');
}

// Main translation loop
async function main() {
  console.log(`\n🌍 Translating to: ${targetLang}`);
  console.log(`📍 Starting from index: ${effectiveStart}`);
  console.log(`⏱️  Delay between requests: ${DELAY_BETWEEN_REQUESTS_MS}ms`);
  console.log(`📦 Batch size: ${BATCH_SIZE}\n`);

  let translatedCount = progress.completedCount;
  let batchCount = 0;

  for (let i = effectiveStart; i < enReasons.length; i++) {
    const enText = enReasons[i];

    // Skip if already translated (doesn't have TODO marker)
    if (!targetReasons[i].startsWith('[TODO:')) {
      continue;
    }

    try {
      const translated = await translateWithRetry(enText, targetLang);
      targetReasons[i] = translated;
      translatedCount++;
      batchCount++;

      const percent = ((i / enReasons.length) * 100).toFixed(1);
      console.log(`✅ [${i + 1}/${enReasons.length}] (${percent}%) ${translated.substring(0, 60)}...`);

      // Save after each batch
      if (batchCount >= BATCH_SIZE) {
        saveTarget();
        saveProgress(i, translatedCount);
        console.log(`💾 Saved progress at index ${i} (${translatedCount} translated)`);
        batchCount = 0;
        await sleep(DELAY_BETWEEN_BATCHES_MS);
      } else {
        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }
    } catch (error) {
      console.error(`\n❌ Failed at index ${i}. Progress saved. Run with --resume to continue.\n`);
      saveTarget();
      saveProgress(i - 1, translatedCount);
      process.exit(1);
    }
  }

  // Final save
  saveTarget();
  if (existsSync(progressPath)) {
    const { unlinkSync } = await import('fs');
    unlinkSync(progressPath); // Clean up progress file
  }

  console.log(`\n✅ Translation complete!`);
  console.log(`📊 Translated ${translatedCount} entries to ${targetLang}`);
  console.log(`📁 Saved to: ${targetPath}\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
