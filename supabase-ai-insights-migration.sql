-- ============================================
-- ADD AI INSIGHTS STORAGE TO ASSESSMENT RESULTS
-- ============================================
-- This migration adds columns to store AI-generated insights
-- so they persist and can be used for reports/exports

ALTER TABLE assessment_results
ADD COLUMN IF NOT EXISTS ai_strengths JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_weaknesses JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_career_suggestions JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_approach_dos JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_approach_donts JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_insights_source VARCHAR(20) DEFAULT NULL CHECK (ai_insights_source IN ('ai', 'fallback', NULL));

COMMENT ON COLUMN assessment_results.ai_strengths IS 'AI-generated strengths (array of strings stored as JSONB)';
COMMENT ON COLUMN assessment_results.ai_weaknesses IS 'AI-generated weaknesses (array of strings stored as JSONB)';
COMMENT ON COLUMN assessment_results.ai_career_suggestions IS 'AI-generated career suggestions (array of strings stored as JSONB)';
COMMENT ON COLUMN assessment_results.ai_approach_dos IS 'AI-generated approach do''s (array of strings stored as JSONB)';
COMMENT ON COLUMN assessment_results.ai_approach_donts IS 'AI-generated approach don''ts (array of strings stored as JSONB)';
COMMENT ON COLUMN assessment_results.ai_insights_source IS 'Source of insights: ai (OpenAI), fallback (static templates), or NULL (not generated)';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_results_ai_source ON assessment_results(ai_insights_source);
