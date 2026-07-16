import crypto from 'crypto';
import { getConfig, isLocalDevEnvironment } from './config.js';

const COOKIE_NAME = 'mvaf_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const loginAttempts = new Map();

function getSecret() {
  if (process.env.ASSET_FOUNDRY_SESSION_SECRET) return process.env.ASSET_FOUNDRY_SESSION_SECRET;
  if (isLocalDevEnvironment()) return 'mvaf-local-dev-session-secret-not-for-production';
  throw new Error('ASSET_FOUNDRY_SESSION_SECRET missing');
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((part) => {
    const [k, ...rest] = part.trim().split('=');
    if (!k) return;
    out[k] = decodeURIComponent(rest.join('=') || '');
  });
  return out;
}

export function getSession(req) {
  try {
    const cookies = parseCookies(req);
    const cookieSession = verify(cookies[COOKIE_NAME]);
    if (cookieSession) return cookieSession;
    // Local development: allow producer testing without password friction
    if (isLocalDevEnvironment() && process.env.OPENAI_API_KEY) {
      return {
        sub: 'foundry-local-dev',
        identity: 'George',
        localDev: true,
        iat: Date.now(),
        exp: Date.now() + SESSION_TTL_MS,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function requireSession(req, res) {
  const session = getSession(req);
  if (!session) {
    json(res, 401, { ok: false, error: 'Authentication required.' });
    return null;
  }
  return session;
}

export function setSessionCookie(res, identity = 'George') {
  const payload = {
    sub: 'foundry-producer',
    identity,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };
  const token = sign(payload);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`,
  );
  return payload;
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`);
}

export function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 15 * 60 * 1000;
  }
  entry.count += 1;
  loginAttempts.set(ip, entry);
  if (entry.count > 12) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }
  return { ok: true };
}

export function validatePassword(password) {
  const expected = process.env.ASSET_FOUNDRY_PASSWORD;
  if (!expected || !password) return false;
  const a = Buffer.from(String(password));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(Buffer.alloc(32), Buffer.alloc(32));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function assertOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin) return true;
  try {
    const o = new URL(origin);
    if (host && o.host === host) return true;
    if (o.hostname === 'localhost' || o.hostname === '127.0.0.1') return true;
    if (o.hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

export function requireOrigin(req, res) {
  if (!assertOrigin(req)) {
    json(res, 403, { ok: false, error: 'Invalid request origin.' });
    return false;
  }
  return true;
}

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 8 * 1024 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export function configStatus() {
  const c = getConfig();
  const production = !c.localDev;
  const generationEnabled = Boolean(
    c.hasOpenAI && (c.localDev || (c.hasPassword && c.hasSessionSecret)),
  );
  return {
    configured: generationEnabled,
    generationEnabled,
    hasOpenAI: c.hasOpenAI,
    hasPassword: c.hasPassword,
    localDev: c.localDev,
    production,
    model: c.model,
    maxBatch: c.maxBatch,
    dailyLimit: c.dailyLimit,
    defaultQuality: c.defaultQuality,
    labels: {
      learning:
        'Preference-guided generation · MedVirtual taste profile · Approval-informed prompting · Reference-guided generation',
      notModelTraining: 'Votes do not fine-tune or retrain OpenAI models.',
    },
  };
}
