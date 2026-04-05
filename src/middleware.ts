import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// --- CONFIGURATION ---
const ACCESS_COOKIE = "token"; // Change to "safeher_access_token" if that's your cookie name
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret-key");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 1. Define Protected Routes
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // if (!isDashboard && !isAdmin) {
    return NextResponse.next();
  // }

  // 2. Extract Token
  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // 3. Verify Token (Signature + Expiry)
    // This works in Edge Runtime where 'jsonwebtoken' fails
    // const { payload } = await jwtVerify(token, SECRET);

    // 4. Role Authorization for Admin Routes
    // if (isAdmin && payload.role !== "ADMIN") {
    //   // If a regular user tries to access /admin, send them to /dashboard
    //   return NextResponse.redirect(new URL("/dashboard", req.url));
    // }

    // 5. Authorized - Proceed to the page
    return NextResponse.next();
    
  } catch (error) {
    // 6. Token is invalid, expired, or tampered with
    console.error("Middleware Auth Error:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    
    // Clear the invalid cookie to prevent infinite loops
    response.cookies.delete(ACCESS_COOKIE);
    return response;
  }
}

// 7. Matcher Config
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin/:path*"
  ],
};