import crypto from "crypto";
import { cookies } from "next/headers";

// Stateless, HMAC-signed session cookie. Only the owner (who knows
// ADMIN_PASSWORD) can mint one. Works on serverless with no session store.
const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD || "prabal"; // override in env
export const COOKIE = "pt_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function checkPassword(input: string): boolean {
  const a = Buffer.from(String(input));
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createToken(): string {
  const payload = { role: "owner", exp: Date.now() + MAX_AGE * 1000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  const sb = Buffer.from(sig);
  const eb = Buffer.from(expected);
  if (sb.length !== eb.length || !crypto.timingSafeEqual(sb, eb)) return false;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString());
    return !p.exp || Date.now() < p.exp;
  } catch {
    return false;
  }
}

export function isOwner(): boolean {
  return verifyToken(cookies().get(COOKIE)?.value);
}

export function setSessionCookie() {
  cookies().set(COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}
