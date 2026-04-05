-- 1. CLEANUP (Remove existing tables to avoid 42P07 error)
DROP TABLE IF EXISTS tracking CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS sos_vault CASCADE;
DROP TABLE IF EXISTS safety_content CASCADE;
DROP TABLE IF EXISTS helplines CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. USERS PROFILE (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')), 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EMERGENCY CONTACTS (3 per user)
CREATE TABLE emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g., 'Mom', 'Dad'
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LIVE TRACKING
CREATE TABLE tracking (
  user_id UUID REFERENCES profiles(id) PRIMARY KEY,
  lat FLOAT8,
  lng FLOAT8,
  is_live BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SOS VAULT (Evidence Storage)
CREATE TABLE sos_vault (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  video_url TEXT,
  location_snapshot JSONB, 
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SAFETY FEED & ARTICLES
CREATE TABLE safety_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('POST', 'ARTICLE')), 
  title TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HELPLINES
CREATE TABLE helplines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PERMISSIONS (Disable RLS for initial development to stop 'Policy Violation' errors)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE tracking DISABLE ROW LEVEL SECURITY;
ALTER TABLE sos_vault DISABLE ROW LEVEL SECURITY;
ALTER TABLE safety_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE helplines DISABLE ROW LEVEL SECURITY;



-- 1. Enable RLS (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow the Login API (Anon Key) to find an email by phone
-- This is required so the 'select' works before the user is logged in
CREATE POLICY "Allow email lookup by phone" 
ON public.profiles 
FOR SELECT 
USING ( true ); 

-- 3. Allow the Registration API (Anon Key) to create a profile
CREATE POLICY "Allow profile creation" 
ON public.profiles 
FOR INSERT 
WITH CHECK ( true );

-- 4. Do the same for Emergency Contacts
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow contact insertion" 
ON public.emergency_contacts 
FOR INSERT 
WITH CHECK ( true );


-- Enable RLS on the table
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create a policy so users can ONLY see their own contacts
-- This uses the built-in auth.uid() function
CREATE POLICY "Users can view their own emergency contacts" 
ON public.emergency_contacts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also allow inserts during registration if you are using Anon Key
CREATE POLICY "Allow public insert for registration" 
ON public.emergency_contacts 
FOR INSERT 
WITH CHECK (true);

-- 1. PROFILES: Allow users to see their own profile (for name/role)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- 2. TRACKING: Allow the dashboard to update your live location
ALTER TABLE public.tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can update own location" ON public.tracking FOR ALL USING (auth.uid() = user_id);

-- 3. SOS VAULT: Allow the SOS button to insert video evidence
ALTER TABLE public.sos_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert SOS evidence" ON public.sos_vault FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. EMERGENCY CONTACTS: (Already added, but here for completeness)
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own contacts" ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);

-- Disable RLS temporarily to verify it's a permission issue
ALTER TABLE public.sos_vault DISABLE ROW LEVEL SECURITY;

-- OR Create a wide-open policy for testing
CREATE POLICY "Allow anyone to insert SOS" 
ON public.sos_vault FOR INSERT 
WITH CHECK (true);