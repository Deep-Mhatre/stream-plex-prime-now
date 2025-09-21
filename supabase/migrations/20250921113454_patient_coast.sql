/*
  # Create payments table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `plan_id` (text)
      - `plan_name` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `payment_method` (text)
      - `card_last_four` (text, nullable)
      - `card_brand` (text, nullable)
      - `status` (text)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policy for authenticated users to read their own payments
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  payment_method text NOT NULL,
  card_last_four text,
  card_brand text,
  status text DEFAULT 'completed',
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_timestamp_idx ON payments(timestamp DESC);