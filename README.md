# ❌ No-as-a-Service

A lightweight API that returns random, creative rejection reasons in **multiple languages** — perfectly suited for any scenario: personal, professional, student life, dev life, or just because.

**🌐 Live API**: `https://no-as-a-service.<your-subdomain>.workers.dev/no`

---

## 🚀 API Usage

### Endpoint

```
GET /no
```

**Rate Limit**: 120 requests per minute per IP

### Language Selection

The API supports multiple languages with this priority:

1. **Query parameter**: `?lang=es` (highest priority)
2. **Accept-Language header**: Parsed with quality values
3. **Default**: English (`en`)

### Supported Languages

| Code | Language |
|------|----------|
| `en` | English (default) |
| `es` | Spanish |
| `fr` | French |
| `ar` | Arabic |

### Examples

```bash
# Default (English)
curl https://no-as-a-service.<your-subdomain>.workers.dev/no

# Spanish via query param
curl "https://no-as-a-service.<your-subdomain>.workers.dev/no?lang=es"

# French via Accept-Language header
curl -H "Accept-Language: fr" https://no-as-a-service.<your-subdomain>.workers.dev/no

# Arabic
curl "https://no-as-a-service.<your-subdomain>.workers.dev/no?lang=ar"
```

### Response Format

```json
{
  "reason": "Lo siento, estoy ocupado contando los azulejos del techo.",
  "lang": "es",
  "availableLangs": ["en", "es", "fr", "ar"]
}
```

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/NoobFullStack/no-as-a-service.git
cd no-as-a-service

# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be available at `http://localhost:8787/no`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Validate build (dry-run deploy) |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run test` | Run tests |
| `npm run i18n:validate` | Validate all locale files |
| `npm run i18n:new-locale -- --lang=XX` | Create new locale template |

---

## 🌍 Adding Translations

### Locale Structure

```
src/i18n/
├── en/reasons.json   # English (source of truth)
├── es/reasons.json   # Spanish
├── fr/reasons.json   # French
├── ar/reasons.json   # Arabic
├── config.ts         # Supported locales
└── index.ts          # Loader
```

### Adding a New Language

1. **Create the template**:
   ```bash
   npm run i18n:new-locale -- --lang=de
   ```

2. **Translate the entries** in `src/i18n/de/reasons.json`
   - Remove `[TODO:DE]` markers as you translate
   - Keep the same number of entries as English

3. **Register the locale** in `src/i18n/config.ts`:
   ```typescript
   export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'ar', 'de'] as const;
   ```

4. **Import in the loader** `src/i18n/index.ts`:
   ```typescript
   import deReasons from './de/reasons.json';
   // Add to reasonsByLocale...
   ```

5. **Validate**:
   ```bash
   npm run i18n:validate
   ```

### Translation Guidelines

- All locale files must have the **same number of entries** as English
- Entries are **index-aligned** (entry #5 in Spanish corresponds to entry #5 in English)
- Keep the tone and style consistent with the original

---

## 🏗️ Build & Type Check

```bash
# Type check
npm run typecheck

# Build validation
npm run build

# Run tests
npm run test
```

---

## 🚀 Deployment

This project deploys to [Cloudflare Workers](https://workers.cloudflare.com/) (free tier).

### First-time Setup

1. Create a free Cloudflare account at https://dash.cloudflare.com/sign-up
2. Login via CLI:
   ```bash
   npx wrangler login
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

Your API will be live at `https://no-as-a-service.<your-subdomain>.workers.dev`

---

## 📁 Project Structure

```
no-as-a-service/
├── src/
│   ├── index.ts              # Cloudflare Workers handler
│   └── i18n/
│       ├── config.ts         # Locale configuration
│       ├── index.ts          # Locale loader
│       ├── index.test.ts     # Unit tests
│       ├── en/reasons.json   # English (1055 reasons)
│       ├── es/reasons.json   # Spanish
│       ├── fr/reasons.json   # French
│       └── ar/reasons.json   # Arabic
├── scripts/i18n/
│   ├── validate.ts           # Validate locale files
│   └── new-locale.ts         # Scaffold new locales
├── wrangler.toml             # Cloudflare config
├── tsconfig.json             # TypeScript config
├── package.json
└── README.md
```

---

## ⚠️ Abuse & Security

### Rate Limiting

- **Per-IP limit**: 120 requests/minute (enforced in code)
- **Daily limit**: 100,000 requests/day (Cloudflare free tier)
- Cloudflare provides automatic DDoS protection

### Privacy

- Only the client IP is used for rate limiting
- No request data is logged or stored
- Rate limit counters are per-isolate and ephemeral

---

## 🙏 Credits

This project is based on [hotheadhacker/no-as-a-service](https://github.com/hotheadhacker/no-as-a-service).

Original concept and rejection reasons by [@hotheadhacker](https://github.com/hotheadhacker).

---

## 📄 License

MIT License

Based on work by [hotheadhacker](https://github.com/hotheadhacker), used under MIT license.
