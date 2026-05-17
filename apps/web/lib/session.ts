import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { db, type UserRole } from "@brothers-trans/database";

const sessionCookieName = "bt_session";

export interface AppSessionUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

function getSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "development-secret";
}

function signPayload(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(userId: string) {
  const payload = JSON.stringify({ userId, createdAt: Date.now() });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

function decodeSession(value: string) {
  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
    userId?: string;
    createdAt?: number;
  };

  if (!payload.userId || !payload.createdAt) {
    return null;
  }

  const maxAgeMs = 1000 * 60 * 60 * 24 * 7;

  if (Date.now() - payload.createdAt > maxAgeMs) {
    return null;
  }

  return payload;
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getSessionUser(): Promise<AppSessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(sessionCookieName)?.value;

  if (!sessionCookie) {
    return null;
  }

  const session = decodeSession(sessionCookie);

  if (!session?.userId) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });
}

export const appSessionCookieName = sessionCookieName;
