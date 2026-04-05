import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ACCESS_COOKIE = "token";
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret-key");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. PUBLIC ROUTES: No protection needed
  if (
    pathname.startsWith("/api/track") || 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") ||
    pathname.startsWith("/admin/login") || 
    pathname.startsWith("/api/admin/login")
  ) {
    return NextResponse.next();
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // If not a protected route, move on
  if (!isDashboard && !isAdmin) return NextResponse.next();

  // 2. TOKEN EXTRACTION
  let token = req.cookies.get(ACCESS_COOKIE)?.value;
  const authHeader = req.headers.get("authorization");

  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 3. NO TOKEN: Redirect to appropriate login
  if (!token) {
    // If they were trying to access /admin, send them to /admin/login
    // Otherwise, send them to the standard /login
    const redirectPath = isAdmin ? "/admin/login" : "/login";
    const loginUrl = new URL(redirectPath, req.url);
    loginUrl.searchParams.set("from", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  try {
    // 4. VERIFY JWT
    const { payload } = await jwtVerify(token, SECRET);

    // 5. ROLE GUARD: Prevent non-admins from entering /admin
    if (isAdmin && payload.role !== "ADMIN") {
      // If a user is logged in but tries to access /admin, bounce them to user /dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 6. CONTEXT INJECTION
    const requestHeaders = new Headers(req.headers);
    if (payload.id) requestHeaders.set("x-user-id", payload.id as string);
    if (payload.role) requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
  } catch (error) {
    console.error("🚨 Auth Failed for:", pathname);
    
    // Clear cookie and redirect to relevant login
    const redirectPath = isAdmin ? "/admin/login" : "/login";
    const response = NextResponse.redirect(new URL(redirectPath, req.url));
    response.cookies.delete(ACCESS_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/dashboard/:path*"],
};