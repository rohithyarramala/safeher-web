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