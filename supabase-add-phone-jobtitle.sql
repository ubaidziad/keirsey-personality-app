-- Add missing phone and job_title columns to participants table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);

-- Add index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_participants_phone ON participants(phone);
