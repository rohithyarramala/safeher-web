import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const ACCESS_COOKIE = "safeher_access_token";
const REFRESH_COOKIE = "safeher_refresh_token";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const email = String(payload?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(payload?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Invalid credentials." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    message: "Login successful.",
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });

  response.cookies.set(ACCESS_COOKIE, data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.session.expires_in,
  });

  response.cookies.set(REFRESH_COOKIE, data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
