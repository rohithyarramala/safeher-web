import { NextRequest, NextResponse } from 'next/server';

const ACCESS_COOKIE = 'safeher_access_token';

function isTokenExpired(token: string): boolean {
  try {
    const payloadRaw = token.split('.')[1];
    if (!payloadRaw) return true;

    const normalized = payloadRaw.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };

    if (!payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken || isTokenExpired(accessToken)) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
