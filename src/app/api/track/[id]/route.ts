import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Define as Promise
) {
  try {
    // 2. Await the params to unlock the 'id'
    const { id } = await params;

    console.log("📍 Fetching Tracking for ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tracking')
      .select('lat, lng, updated_at, is_live')
      .eq('user_id', id) // 3. Use the awaited ID
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!data || !data.is_live) {
      return NextResponse.json({ error: "User is not currently sharing location" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("🔥 Server Crash:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}