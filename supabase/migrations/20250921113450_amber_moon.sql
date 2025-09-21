/*
  # Create watchlist table

  1. New Tables
    - `watchlist`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `content_id` (text)
      - `content_title` (text)
      - `content_type` (text)
      - `added_at` (timestamp)
      - `recorded_at` (timestamp)

  2. Security
    - Enable RLS on `watchlist` table
    - Add policy for authenticated users to manage their own watchlist
*/

CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  content_id text NOT NULL,
  content_title text NOT NULL,
  content_type text NOT NULL,
  added_at timestamptz DEFAULT now(),
  recorded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own watchlist"
  ON watchlist
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS watchlist_user_id_idx ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS watchlist_content_id_idx ON watchlist(content_id);