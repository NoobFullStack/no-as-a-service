# ❌ No-as-a-Service

<p align="center">
  <img src="assets/imgs/no-as-a-service.png" width="600" alt="No-as-a-Service Banner"/>
</p>

A lightweight API that returns random, creative rejection reasons in **multiple languages** — perfectly suited for any scenario: personal, professional, student life, dev life, or just because.

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
git clone https://github.com/NoobFullStack/no-as-a-service.git
cd no-as-a-service
npm install
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
| `npm run i18n:translate -- --lang=XX` | Auto-translate using Google Translate |
| `npm run i18n:new-locale -- --lang=XX` | Create new locale template |

---

## 🚀 Deployment to Cloudflare Workers

### Option 1: CLI Deployment (Recommended)

This is the simplest approach using the Wrangler CLI:

```bash
# 1. Login to Cloudflare (opens browser)
npx wrangler login

# 2. Deploy
npm run deploy
```

Your API will be live at: `https://no-as-a-service.<your-account>.workers.dev`

### Option 2: GitHub Integration (CI/CD)

If you connected your GitHub repo to Cloudflare:

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Click your worker → **Settings** → **Builds & Deployments**
3. Set:
   - **Build command**: `npm run build`
   - **Build output directory**: (leave empty, Wrangler handles it)
4. Deployments will trigger automatically on push to `main`

> **Note**: For GitHub integration, you may need to add a `CLOUDFLARE_API_TOKEN` secret in your repo settings.

### Cost Limits (Free Tier)

Cloudflare Workers **Free tier** includes:

| Limit | Value |
|-------|-------|
| Requests/day | **100,000** |
| CPU time/request | 10ms |
| Workers | Unlimited |

**Important**: The free tier **automatically throttles** when you hit limits — **you will NOT be charged** unless you:
1. Explicitly upgrade to a paid plan
2. Add a payment method AND enable billing

### How to Ensure No Charges

1. **Don't add a payment method** — Without billing info, Cloudflare cannot charge you
2. **Check your plan**: Dashboard → Workers → Overview → Your plan should show "Free"
3. **Monitor usage**: Dashboard → Workers → Analytics shows daily request counts
4. **Set up alerts** (optional): Dashboard → Notifications → Create alert for usage thresholds

### Verifying Free Tier

```bash
# Check your account type via CLI
npx wrangler whoami
```

If it shows "Free" plan, you're safe. Cloudflare will return 429 errors when limits are exceeded, not bills.

---

## 🌍 Adding Translations

### Auto-Translation (Free Google Translate)

```bash
# Translate to Spanish (resumes if interrupted)
npm run i18n:translate -- --lang=es --resume

# Translate all languages
npm run i18n:translate -- --lang=es && \
npm run i18n:translate -- --lang=fr && \
npm run i18n:translate -- --lang=ar
```

The script includes:
- Rate limiting (500ms between requests)
- Exponential backoff on 429 errors
- Progress saving (resumes if interrupted)

### Manual Translation

1. Create template: `npm run i18n:new-locale -- --lang=de`
2. Edit `src/i18n/de/reasons.json`
3. Remove `[TODO:DE]` markers as you translate
4. Register in `src/i18n/config.ts`
5. Validate: `npm run i18n:validate`

---

## 📁 Project Structure

```
no-as-a-service/
├── src/
│   ├── index.ts              # Cloudflare Workers handler
│   └── i18n/
│       ├── config.ts         # Locale configuration
│       ├── index.ts          # Locale loader
│       ├── en/reasons.json   # English (1055 reasons)
│       ├── es/reasons.json   # Spanish
│       ├── fr/reasons.json   # French
│       └── ar/reasons.json   # Arabic
├── scripts/i18n/
│   ├── validate.ts           # Validate locale files
│   ├── translate.ts          # Auto-translate with Google
│   └── new-locale.ts         # Scaffold new locales
├── assets/imgs/              # Images
├── wrangler.toml             # Cloudflare config
├── tsconfig.json             # TypeScript config
└── package.json
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

MIT License — Based on work by [hotheadhacker](https://github.com/hotheadhacker), used under MIT license.
