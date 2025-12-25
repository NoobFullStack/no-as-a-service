import reasons from '../reasons.json';

interface Env {
  // Add environment bindings here if needed
}

// Rate limiting state (in-memory, per-isolate)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 120; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

function getClientIP(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT) {
    return true;
  }

  return false;
}

function handleNoRequest(): Response {
  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  return Response.json({ reason });
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const ip = getClientIP(request);

    // Rate limiting
    if (isRateLimited(ip)) {
      return Response.json(
        { error: 'Too many requests, please try again later. (120 reqs/min/IP)' },
        { status: 429 }
      );
    }

    // Routing
    if (url.pathname === '/no' || url.pathname === '/no/') {
      return handleNoRequest();
    }

    // Root redirect or info
    if (url.pathname === '/' || url.pathname === '') {
      return Response.json({
        service: 'No-as-a-Service',
        endpoint: '/no',
        description: 'Returns a random rejection reason',
        rateLimit: '120 requests/minute/IP',
      });
    }

    return Response.json({ error: 'Not found' }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
