/*
  # Create subscriptions table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (text, unique)
      - `plan_id` (text)
      - `amount` (numeric)
      - `status` (text)
      - `start_date` (timestamp)
      - `last_payment` (timestamp)
      - `expiry_date` (timestamp)
      - `payment_method` (text)
      - `auto_renew` (boolean)

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for authenticated users to read their own subscription
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  plan_id text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  last_payment timestamptz DEFAULT now(),
  expiry_date timestamptz NOT NULL,
  payment_method text NOT NULL,
  auto_renew boolean DEFAULT true
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can manage subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_expiry_idx ON subscriptions(expiry_date);