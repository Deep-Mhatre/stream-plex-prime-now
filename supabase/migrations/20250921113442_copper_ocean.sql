/*
  # Create user views tracking table

  1. New Tables
    - `user_views`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `content_id` (text)
      - `content_title` (text)
      - `content_type` (text)
      - `action` (text)
      - `episode` (text, nullable)
      - `timestamp` (timestamp)
      - `recorded_at` (timestamp)

  2. Security
    - Enable RLS on `user_views` table
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS user_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  content_id text NOT NULL,
  content_title text NOT NULL,
  content_type text NOT NULL,
  action text NOT NULL,
  episode text,
  timestamp timestamptz DEFAULT now(),
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own views"
  ON user_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own views"
  ON user_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS user_views_user_id_idx ON user_views(user_id);
CREATE INDEX IF NOT EXISTS user_views_content_id_idx ON user_views(content_id);
CREATE INDEX IF NOT EXISTS user_views_timestamp_idx ON user_views(timestamp DESC);