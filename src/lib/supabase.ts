import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type VerifiedContent = {
  id: string;
  content_hash: string;
  content_type: 'image' | 'video' | 'text';
  filecoin_cid: string;
  wallet_address: string;
  creator_name: string;
  title: string;
  description: string;
  blockchain_tx_hash: string;
  ai_verification_score: number | null;
  verification_status: 'verified' | 'pending' | 'flagged';
  created_at: string;
};

export type VerificationCheck = {
  id: string;
  checked_hash: string;
  matched_content_id: string | null;
  check_result: 'verified' | 'unverified' | 'suspicious';
  checker_ip: string;
  created_at: string;
};
