-- Run this in Supabase SQL Editor to fix RLS policy errors
-- This allows anonymous users to submit assessments

-- Drop existing policies
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

-- ADMIN SETTINGS: Read-only for anonymous
CREATE POLICY "Allow public select on admin_settings" ON admin_settings
  FOR SELECT TO anon, authenticated USING (true);
