import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ⚠️ IMPORTANT: Use SERVICE_ROLE_KEY here so we can manage profiles 
// even if the user isn't fully logged in or confirmed yet.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
);

export async function POST(req: Request) {
  try {
    const { email, phone, password, full_name, emergency_contacts } = await req.json();

    // 1. SIGN UP / SIGN IN check
    // Supabase signUp will return the user if they already exist but haven't confirmed email,
    // or it will return an error if the email is taken.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    // If user already exists, signUp might return an empty user or an error depending on Supabase settings.
    // We handle the "User already registered" error specifically.
    if (authError) {
      if (authError.message.includes("User already registered")) {
        return NextResponse.json({ error: "Email already in use. Please login." }, { status: 400 });
      }
      throw authError;
    }

    const userId = authData.user?.id;
    if (!userId) throw new Error("Could not retrieve User ID");

    // 2. UPSERT PROFILE
    // 'upsert' will insert a new row or update the existing one if the ID matches.
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId, 
        full_name, 
        phone, 
        email, 
        role: 'USER' 
      }, { onConflict: 'id' });

    if (profileError) {
      if (profileError.message.includes("profiles_phone_key")) {
        throw new Error("Phone number is already linked to another account.");
      }
      throw profileError;
    }

    // 3. REFRESH EMERGENCY CONTACTS
    // We delete old ones and insert new ones to ensure the list is exactly 3.
    await supabase.from('emergency_contacts').delete().eq('user_id', userId);

    const contacts = emergency_contacts.map((c: any) => ({
      user_id: userId,
      label: c.label,
      phone: c.phone
    }));
    
    const { error: contactError } = await supabase.from('emergency_contacts').insert(contacts);
    if (contactError) throw contactError;

    return NextResponse.json({ 
      success: true, 
      message: "SafeHer account ready! Please login to continue." 
    });

  } catch (err: any) {
    console.error("Registration Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}