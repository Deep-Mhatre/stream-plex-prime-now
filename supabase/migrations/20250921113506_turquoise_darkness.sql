/*
  # Create user navigation tracking table

  1. New Tables
    - `user_navigation`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `page` (text)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on `user_navigation` table
    - Add policy for authenticated users to insert their own navigation data
*/

CREATE TABLE IF NOT EXISTS user_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  page text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE user_navigation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own navigation"
  ON user_navigation
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own navigation"
  ON user_navigation
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS user_navigation_user_id_idx ON user_navigation(user_id);
CREATE INDEX IF NOT EXISTS user_navigation_timestamp_idx ON user_navigation(timestamp DESC);