/*
  # Initial Schema Setup for Promise Keeper App

  1. New Tables
    - promises
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - title (text)
      - description (text)
      - deadline (timestamp with time zone)
      - penalty_amount (numeric)
      - status (enum: pending, completed, failed)
      - created_at (timestamp with time zone)
      - charity_id (uuid, references charities)
    
    - charities
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - image_url (text)
      - created_at (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access to their own promises
    - Add policies for public read access to charities
*/

-- Create custom types
CREATE TYPE promise_status AS ENUM ('pending', 'completed', 'failed');

-- Create charities table
CREATE TABLE IF NOT EXISTS charities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create promises table
CREATE TABLE IF NOT EXISTS promises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  deadline timestamptz NOT NULL,
  penalty_amount numeric NOT NULL CHECK (penalty_amount > 0),
  status promise_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  charity_id uuid REFERENCES charities
);

-- Enable Row Level Security
ALTER TABLE promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;

-- Promises policies
CREATE POLICY "Users can create their own promises"
  ON promises
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own promises"
  ON promises
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own promises"
  ON promises
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Charities policies
CREATE POLICY "Charities are viewable by everyone"
  ON charities
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX promises_user_id_idx ON promises(user_id);
CREATE INDEX promises_status_idx ON promises(status);
CREATE INDEX promises_deadline_idx ON promises(deadline);