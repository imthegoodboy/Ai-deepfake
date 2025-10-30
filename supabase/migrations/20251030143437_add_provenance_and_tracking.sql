/*
  # Add Provenance Tracking and Real-time Status

  1. New Tables
    - `content_provenance`
      - `id` (uuid, primary key)
      - `content_id` (uuid) - Reference to verified_content
      - `event_type` (text) - created, modified, transferred, flagged
      - `actor_wallet` (text) - Wallet address of actor
      - `details` (jsonb) - Additional event details
      - `blockchain_ref` (text) - Transaction hash reference
      - `created_at` (timestamptz)
      
    - `verification_status_log`
      - `id` (uuid, primary key)
      - `content_id` (uuid) - Reference to verified_content
      - `status` (text) - pending, processing, verified, failed
      - `progress_percentage` (integer)
      - `message` (text)
      - `created_at` (timestamptz)
    
    - `threat_reports`
      - `id` (uuid, primary key)
      - `content_id` (uuid) - Reference to verified_content
      - `reporter_wallet` (text)
      - `threat_type` (text)
      - `severity` (text) - low, medium, high, critical
      - `description` (text)
      - `status` (text) - pending, reviewed, resolved
      - `created_at` (timestamptz)

  2. Indexes
    - Fast lookup for provenance by content
    - Fast lookup for status logs
    - Fast lookup for threat reports

  3. Security
    - Enable RLS on all tables
    - Public can view provenance
    - Authenticated users can add provenance
    - Public can view threat reports
    - Authenticated users can create threat reports
*/

-- Create content_provenance table
CREATE TABLE IF NOT EXISTS content_provenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES verified_content(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created', 'modified', 'transferred', 'flagged', 'verified', 'ai_analyzed')),
  actor_wallet text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  blockchain_ref text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create verification_status_log table
CREATE TABLE IF NOT EXISTS verification_status_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES verified_content(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'verified', 'failed')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create threat_reports table
CREATE TABLE IF NOT EXISTS threat_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES verified_content(id) ON DELETE CASCADE,
  reporter_wallet text NOT NULL,
  threat_type text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_provenance_content ON content_provenance(content_id);
CREATE INDEX IF NOT EXISTS idx_content_provenance_created ON content_provenance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verification_status_content ON verification_status_log(content_id);
CREATE INDEX IF NOT EXISTS idx_verification_status_created ON verification_status_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_reports_content ON threat_reports(content_id);
CREATE INDEX IF NOT EXISTS idx_threat_reports_status ON threat_reports(status);

-- Enable RLS
ALTER TABLE content_provenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_provenance
CREATE POLICY "Anyone can view provenance"
  ON content_provenance FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add provenance"
  ON content_provenance FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for verification_status_log
CREATE POLICY "Anyone can view status logs"
  ON verification_status_log FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create status logs"
  ON verification_status_log FOR INSERT
  WITH CHECK (true);

-- RLS Policies for threat_reports
CREATE POLICY "Anyone can view threat reports"
  ON threat_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create threat reports"
  ON threat_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their reports"
  ON threat_reports FOR UPDATE
  TO authenticated
  USING (reporter_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address')
  WITH CHECK (reporter_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');