import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req: Request) {
  // 1. Check Cookie OR Authorization Header
  const token = (await cookies()).get('token')?.value || 
                req.headers.get('Authorization')?.split(' ')[1];

  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({ 
      user: { id: payload.id, phone: payload.phone },
      supabaseAccessToken: token 
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}