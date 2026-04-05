import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type EmergencyContact = {
  name: string;
  phone: string;
};

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const email = String(payload?.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(payload?.password ?? "");
  const phone = String(payload?.phone ?? "").trim();
  const contacts = Array.isArray(payload?.contacts)
    ? (payload.contacts as EmergencyContact[])
    : [];

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const safeContacts = contacts
    .filter(
      (item) =>
        item && typeof item.name === "string" && typeof item.phone === "string",
    )
    .map((item) => ({ name: item.name.trim(), phone: item.phone.trim() }))
    .filter((item) => item.name.length > 0 && item.phone.length > 0);

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { phone },
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message || "Unable to register user." },
      { status: 400 },
    );
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    email,
    phone,
    emergency_contacts: safeContacts,
    role: "user",
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    message:
      "Registration successful. Verify your email before login if confirmation is enabled.",
    user: { id: data.user.id, email: data.user.email },
  });
}
