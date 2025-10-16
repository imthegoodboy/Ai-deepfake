/*
  # TrustLens Database Schema

  1. New Tables
    - `verified_content`
      - `id` (uuid, primary key)
      - `content_hash` (text, unique) - SHA-256 hash of the content
      - `content_type` (text) - image, video, or text
      - `filecoin_cid` (text) - IPFS/Filecoin content identifier
      - `wallet_address` (text) - Creator's wallet address
      - `creator_name` (text, optional) - Display name
      - `title` (text) - Content title
      - `description` (text, optional) - Content description
      - `blockchain_tx_hash` (text) - Simulated Polygon transaction hash
      - `ai_verification_score` (numeric, optional) - Deepfake detection score (0-100)
      - `verification_status` (text) - verified, pending, flagged
      - `created_at` (timestamptz) - Verification timestamp
      
    - `verification_checks`
      - `id` (uuid, primary key)
      - `checked_hash` (text) - Hash of content being verified
      - `matched_content_id` (uuid, nullable) - Reference to verified_content if match found
      - `check_result` (text) - verified, unverified, suspicious
      - `checker_ip` (text, optional) - For rate limiting
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for verified content
    - Authenticated users can create verified content
    - Public can create verification checks
*/

-- Create verified_content table
CREATE TABLE IF NOT EXISTS verified_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_hash text UNIQUE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('image', 'video', 'text')),
  filecoin_cid text NOT NULL,
  wallet_address text NOT NULL,
  creator_name text DEFAULT '',
  title text NOT NULL,
  description text DEFAULT '',
  blockchain_tx_hash text NOT NULL,
  ai_verification_score numeric CHECK (ai_verification_score >= 0 AND ai_verification_score <= 100),
  verification_status text DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'flagged')),
  created_at timestamptz DEFAULT now()
);

-- Create verification_checks table
CREATE TABLE IF NOT EXISTS verification_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_hash text NOT NULL,
  matched_content_id uuid REFERENCES verified_content(id),
  check_result text NOT NULL CHECK (check_result IN ('verified', 'unverified', 'suspicious')),
  checker_ip text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verified_content_hash ON verified_content(content_hash);
CREATE INDEX IF NOT EXISTS idx_verified_content_wallet ON verified_content(wallet_address);
CREATE INDEX IF NOT EXISTS idx_verification_checks_hash ON verification_checks(checked_hash);
CREATE INDEX IF NOT EXISTS idx_verified_content_created ON verified_content(created_at DESC);

-- Enable RLS
ALTER TABLE verified_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verified_content
CREATE POLICY "Anyone can view verified content"
  ON verified_content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create verified content"
  ON verified_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can update their own content"
  ON verified_content FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- RLS Policies for verification_checks
CREATE POLICY "Anyone can view verification checks"
  ON verification_checks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create verification checks"
  ON verification_checks FOR INSERT
  WITH CHECK (true);