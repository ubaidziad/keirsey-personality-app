-- Add AI insights columns to assessment_results table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE assessment_results 
ADD COLUMN IF NOT EXISTS ai_strengths TEXT,
ADD COLUMN IF NOT EXISTS ai_weaknesses TEXT,
ADD COLUMN IF NOT EXISTS ai_career_suggestions TEXT,
ADD COLUMN IF NOT EXISTS ai_approach_dos TEXT,
ADD COLUMN IF NOT EXISTS ai_approach_donts TEXT,
ADD COLUMN IF NOT EXISTS ai_insights_source VARCHAR(20) DEFAULT 'fallback' 
  CHECK (ai_insights_source IN ('ai', 'fallback'));

-- Drop and recreate the recent_assessments view with correct column order
DROP VIEW IF EXISTS recent_assessments;

CREATE VIEW recent_assessments AS
SELECT 
  ar.id,
  ar.created_at,
  p.full_name,
  p.email,
  p.department,
  p.phone,
  p.job_title,
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
