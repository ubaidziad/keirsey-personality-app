-- ============================================
-- MIGRATION: Add organization support and update views
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- 1. Add organization index (column already exists)
CREATE INDEX IF NOT EXISTS idx_participants_organization ON participants(organization);

-- 2. Update recent_assessments view to include organization
--    (DROP + CREATE because column order changed; CREATE OR REPLACE doesn't allow that)
DROP VIEW IF EXISTS recent_assessments;
CREATE VIEW recent_assessments AS
SELECT 
  ar.id,
  ar.created_at,
  p.full_name,
  p.email,
  p.phone,
  p.job_title,
  p.department,
  p.organization,
  ar.dominant_type,
  ar.secondary_type,
  ar.is_hybrid,
  ar.mbti_code,
  ar.guardian_score,
  ar.rational_score,
  ar.idealist_score,
  ar.artisan_score,
  ar.ai_strengths,
  ar.ai_weaknesses,
  ar.ai_career_suggestions,
  ar.ai_approach_dos,
  ar.ai_approach_donts,
  ar.ai_insights_source
FROM assessment_results ar
JOIN participants p ON ar.participant_id = p.id
ORDER BY ar.created_at DESC;

-- 3. Add delete policy for participants (needed for admin email reset)
DROP POLICY IF EXISTS "Allow authenticated delete on participants" ON participants;
CREATE POLICY "Allow authenticated delete on participants" ON participants
  FOR DELETE TO authenticated USING (true);

-- 4. Add delete policy for assessment_results  
DROP POLICY IF EXISTS "Allow authenticated delete on assessment_results" ON assessment_results;
CREATE POLICY "Allow authenticated delete on assessment_results" ON assessment_results
  FOR DELETE TO authenticated USING (true);

-- 5. Add delete policy for assessment_sessions
DROP POLICY IF EXISTS "Allow authenticated delete on assessment_sessions" ON assessment_sessions;
CREATE POLICY "Allow authenticated delete on assessment_sessions" ON assessment_sessions
  FOR DELETE TO authenticated USING (true);

-- 6. Add delete policy for responses
DROP POLICY IF EXISTS "Allow authenticated delete on responses" ON responses;
CREATE POLICY "Allow authenticated delete on responses" ON responses
  FOR DELETE TO authenticated USING (true);
