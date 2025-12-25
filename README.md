# ❌ No-as-a-Service

A lightweight API that returns random, creative rejection reasons — perfectly suited for any scenario: personal, professional, student life, dev life, or just because.

**🌐 Live API**: `https://no-as-a-service.<your-subdomain>.workers.dev/no`

---

## 🚀 API Usage

**Endpoint**: `GET /no`  
**Rate Limit**: 120 requests per minute per IP

### Example Request

```bash
curl https://no-as-a-service.<your-subdomain>.workers.dev/no
```

### Example Response

```json
{
  "reason": "This feels like something Future Me would yell at Present Me for agreeing to."
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

---

## 🏗️ Build & Type Check

```bash
# Type check
npm run typecheck

# Build validation
npm run build
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
│   └── index.ts        # Cloudflare Workers fetch handler
├── reasons.json        # 1000+ rejection reasons
├── wrangler.toml       # Cloudflare Workers config
├── tsconfig.json       # TypeScript config
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

### Recommendations for Self-Hosting

- Consider adding Cloudflare Access rules for sensitive deployments
- Monitor usage in the Cloudflare dashboard
- The free tier will throttle (not bill) on overuse

---

## 🙏 Credits

This project is based on [hotheadhacker/no-as-a-service](https://github.com/hotheadhacker/no-as-a-service).

Original concept and rejection reasons by [@hotheadhacker](https://github.com/hotheadhacker).

---

## 📄 License

MIT License

Based on work by [hotheadhacker](https://github.com/hotheadhacker), used under MIT license.
