/*
  # Create user interactions table

  1. New Tables
    - `user_interactions`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `query` (text, nullable)
      - `result_count` (integer, nullable)
      - `content_id` (text, nullable)
      - `content_title` (text, nullable)
      - `content_type` (text, nullable)
      - `rating` (integer, nullable)
      - `action` (text)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on `user_interactions` table
    - Add policy for authenticated users to manage their own interactions
*/

CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  query text,
  result_count integer,
  content_id text,
  content_title text,
  content_type text,
  rating integer,
  action text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own interactions"
  ON user_interactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS user_interactions_action_idx ON user_interactions(action);
CREATE INDEX IF NOT EXISTS user_interactions_timestamp_idx ON user_interactions(timestamp DESC);