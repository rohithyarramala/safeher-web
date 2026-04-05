import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);


const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, email, password } = body;

    let targetEmail = email;

    // 1. Phone-to-Email Lookup
    if (phone) {
      console.log("🔍 Looking up phone:", phone);
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone', phone.trim())
        .single();
      
      // If RLS is ON and no policy exists, profile will be null
      if (pError || !profile) {
        console.error("❌ Profile Lookup Failed:", pError?.message || "No profile found");
        return NextResponse.json({ 
          error: "Phone number not registered or lookup blocked by RLS" 
        }, { status: 404 });
      }
      targetEmail = profile.email;
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "Missing email/phone" }, { status: 400 });
    }

    // 2. Auth Sign In
    const { data, error: authError } = await supabase.auth.signInWithPassword({ 
      email: targetEmail, 
      password 
    });

    if (authError) {
      console.error("❌ Supabase Auth Error:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    // 3. Fetch Full Profile
    const { data: fullProfile, error: fError } = await supabase
      .from('profiles')
      .select('role, phone, full_name')
      .eq('id', data.user.id)
      .single();

    if (fError || !fullProfile) {
       console.error("❌ Final Profile Fetch Failed:", fError?.message);
       // We don't crash here, we provide defaults
    }

    // 4. Generate JWT
    const token = await new SignJWT({ 
        id: data.user.id, 
        role: fullProfile?.role || 'USER',
        phone: fullProfile?.phone 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET);

    const response = NextResponse.json({
      success: true,
      user: { 
        id: data.user.id, 
        role: fullProfile?.role, 
        name: fullProfile?.full_name 
      }
    });

    // 5. Set Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err: any) {
    // THIS LOGS THE ACTUAL CRASH REASON IN YOUR TERMINAL
    console.error("🔥 CRITICAL SERVER ERROR:", err);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: err.message 
    }, { status: 500 });
  }
}