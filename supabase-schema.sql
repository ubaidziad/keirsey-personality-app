-- Keirsey Personality Assessment Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  job_title VARCHAR(255),
  department VARCHAR(255),
  organization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_department ON participants(department);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at DESC);

-- ============================================
-- ASSESSMENT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'ms')),
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  question_order JSONB, -- Stores the randomized question order
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_participant ON assessment_sessions(participant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON assessment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON assessment_sessions(completed_at DESC);

-- ============================================
-- RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer CHAR(1) NOT NULL CHECK (answer IN ('a', 'b')),
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(session_id);

-- ============================================
-- ASSESSMENT RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE UNIQUE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  
  -- MBTI Dimensions (raw scores)
  e_score INTEGER NOT NULL DEFAULT 0,
  i_score INTEGER NOT NULL DEFAULT 0,
  s_score INTEGER NOT NULL DEFAULT 0,
  n_score INTEGER NOT NULL DEFAULT 0,
  t_score INTEGER NOT NULL DEFAULT 0,
  f_score INTEGER NOT NULL DEFAULT 0,
  j_score INTEGER NOT NULL DEFAULT 0,
  p_score INTEGER NOT NULL DEFAULT 0,
  
  -- Derived MBTI code (e.g., 'INTJ')
  mbti_code VARCHAR(4) NOT NULL,
  
  -- Keirsey Temperament scores (percentages)
  guardian_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  rational_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  idealist_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  artisan_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  
  -- Dominant and secondary types
  dominant_type VARCHAR(20) NOT NULL CHECK (dominant_type IN ('guardian', 'rational', 'idealist', 'artisan')),
  secondary_type VARCHAR(20) NOT NULL CHECK (secondary_type IN ('guardian', 'rational', 'idealist', 'artisan')),
  is_hybrid BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_participant ON assessment_results(participant_id);
CREATE INDEX IF NOT EXISTS idx_results_dominant_type ON assessment_results(dominant_type);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON assessment_results(created_at DESC);

-- ============================================
-- ADMIN SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES
  ('logo_url', '""'),
  ('data_retention_months', '12'),
  ('organization_name', '"Keirsey Assessment"')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View: Personality type distribution
CREATE OR REPLACE VIEW personality_distribution AS
SELECT 
  dominant_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / NULLIF((SELECT COUNT(*) FROM assessment_results), 0), 2) as percentage
FROM assessment_results
GROUP BY dominant_type
ORDER BY count DESC;

-- View: Department breakdown
CREATE OR REPLACE VIEW department_breakdown AS
SELECT 
  p.department,
  COUNT(DISTINCT p.id) as participant_count,
  COUNT(DISTINCT ar.id) as completed_assessments
FROM participants p
LEFT JOIN assessment_results ar ON p.id = ar.participant_id
WHERE p.department IS NOT NULL
GROUP BY p.department
ORDER BY participant_count DESC;

-- View: Recent assessments with participant info
CREATE OR REPLACE VIEW recent_assessments AS
SELECT 
  ar.id,
  ar.created_at,
  p.full_name,
  p.email,
  p.department,
  ar.dominant_type,
  ar.secondary_type,
  ar.is_hybrid,
  ar.mbti_code,
  ar.guardian_score,
  ar.rational_score,
  ar.idealist_score,
  ar.artisan_score
FROM assessment_results ar
JOIN participants p ON ar.participant_id = p.id
ORDER BY ar.created_at DESC;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for participants
DROP TRIGGER IF EXISTS update_participants_updated_at ON participants;
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for admin_settings
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public insert on participants" ON participants;
DROP POLICY IF EXISTS "Allow public select on participants" ON participants;
DROP POLICY IF EXISTS "Allow public insert on assessment_sessions" ON assessment_sessions;
DROP POLICY IF EXISTS "Allow public select on own sessions" ON assessment_sessions;
DROP POLICY IF EXISTS "Allow public update on own sessions" ON assessment_sessions;
DROP POLICY IF EXISTS "Allow public insert on responses" ON responses;
DROP POLICY IF EXISTS "Allow public select on own responses" ON responses;
DROP POLICY IF EXISTS "Allow public insert on assessment_results" ON assessment_results;
DROP POLICY IF EXISTS "Allow public select on own results" ON assessment_results;

-- PARTICIPANTS: Allow anonymous users to insert and select
CREATE POLICY "Allow public insert on participants" ON participants
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on participants" ON participants
  FOR SELECT TO anon, authenticated USING (true);

-- ASSESSMENT SESSIONS: Allow anonymous users full access
CREATE POLICY "Allow public insert on assessment_sessions" ON assessment_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on assessment_sessions" ON assessment_sessions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public update on assessment_sessions" ON assessment_sessions
  FOR UPDATE TO anon, authenticated USING (true);

-- RESPONSES: Allow anonymous users full access
CREATE POLICY "Allow public insert on responses" ON responses
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on responses" ON responses
  FOR SELECT TO anon, authenticated USING (true);

-- ASSESSMENT RESULTS: Allow anonymous users full access
CREATE POLICY "Allow public insert on assessment_results" ON assessment_results
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select on assessment_results" ON assessment_results
  FOR SELECT TO anon, authenticated USING (true);

-- ADMIN SETTINGS: Read-only for anonymous, full access for authenticated
CREATE POLICY "Allow public select on admin_settings" ON admin_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Note: Service role key bypasses all RLS policies automatically

-- ============================================
-- SAMPLE QUERY: Get stats for admin dashboard
-- ============================================
-- SELECT 
--   (SELECT COUNT(*) FROM participants) as total_participants,
--   (SELECT COUNT(*) FROM assessment_results) as completed_assessments,
--   (SELECT json_object_agg(dominant_type, percentage) FROM personality_distribution) as distribution;
