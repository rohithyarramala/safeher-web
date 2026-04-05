import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-fallback-secret-key");

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      
      const token = await new SignJWT({ 
          id: 'admin_root', 
          role: 'ADMIN'  // <--- CRITICAL: Must match Middleware check
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(SECRET);

      const response = NextResponse.json({ success: true });

      // Set cookie directly on the response object
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better redirect handling
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours
      });

      return response;
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}