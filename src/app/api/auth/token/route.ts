import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const identifier = String(payload?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(payload?.password ?? "");

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const email = identifier;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || "Invalid credentials" },
      { status: 401 },
    );
  }

  return NextResponse.json({ token: data.session.access_token });
}
