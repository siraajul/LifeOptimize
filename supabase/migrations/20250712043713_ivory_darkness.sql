/*
  # Life Optimization Tracker Database Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `age` (integer)
      - `height` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weight_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `weight` (numeric)
      - `date` (date)
      - `notes` (text, optional)
      - `created_at` (timestamp)
    
    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `hours` (numeric)
      - `modules` (integer array)
      - `topics` (text array)
      - `notes` (text, optional)
      - `date` (date)
      - `created_at` (timestamp)
    
    - `workout_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (text)
      - `duration` (numeric)
      - `exercises` (text array)
      - `notes` (text, optional)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer DEFAULT 28,
  height integer DEFAULT 168,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create user_data table
CREATE TABLE IF NOT EXISTS public.user_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON public.user_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data"
  ON public.user_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own data"
  ON public.user_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create weight_entries table
CREATE TABLE IF NOT EXISTS public.weight_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight numeric NOT NULL,
  date date NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight entries"
  ON public.weight_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create weight entries"
  ON public.weight_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries"
  ON public.weight_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries"
  ON public.weight_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hours numeric NOT NULL,
  modules integer[] DEFAULT '{}',
  topics text[] DEFAULT '{}',
  notes text DEFAULT '',
  date date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sessions"
  ON public.study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create study sessions"
  ON public.study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON public.study_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions"
  ON public.study_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  duration numeric NOT NULL,
  exercises text[] DEFAULT '{}',
  notes text DEFAULT '',
  date date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout sessions"
  ON public.workout_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create workout sessions"
  ON public.workout_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
  ON public.workout_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
  ON public.workout_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_id ON public.weight_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON public.weight_entries(date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON public.workout_sessions(date);