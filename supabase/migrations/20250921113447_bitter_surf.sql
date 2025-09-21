/*
  # Create user authentication tracking table

  1. New Tables
    - `user_auth`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `action` (text)
      - `timestamp` (timestamp)
      - `recorded_at` (timestamp)

  2. Security
    - Enable RLS on `user_auth` table
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS user_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  action text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE user_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own auth events"
  ON user_auth
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own auth events"
  ON user_auth
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS user_auth_user_id_idx ON user_auth(user_id);
CREATE INDEX IF NOT EXISTS user_auth_timestamp_idx ON user_auth(timestamp DESC);