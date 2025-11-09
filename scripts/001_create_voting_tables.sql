-- Create voters table for storing voter information
CREATE TABLE IF NOT EXISTS public.voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id VARCHAR(20) UNIQUE NOT NULL, -- Voter ID from Election Commission
  aadhaar_number VARCHAR(12) UNIQUE NOT NULL, -- Aadhaar card number
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  phone_number VARCHAR(15),
  email VARCHAR(255),
  face_encoding TEXT, -- Stored face recognition data
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create elections table
CREATE TABLE IF NOT EXISTS public.elections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  election_type VARCHAR(50) NOT NULL, -- 'general', 'state', 'local'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  candidate_name VARCHAR(255) NOT NULL,
  party_name VARCHAR(255) NOT NULL,
  party_symbol VARCHAR(255), -- URL to party symbol image
  candidate_photo VARCHAR(255), -- URL to candidate photo
  manifesto TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table for blockchain voting records
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  blockchain_hash VARCHAR(255) UNIQUE NOT NULL, -- Blockchain transaction hash
  vote_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT TRUE,
  UNIQUE(election_id, voter_id) -- Ensure one vote per voter per election
);

-- Create vote_verification table for additional security
CREATE TABLE IF NOT EXISTS public.vote_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vote_id UUID NOT NULL REFERENCES public.votes(id) ON DELETE CASCADE,
  face_match_score DECIMAL(5,4), -- Face recognition confidence score
  ip_address INET,
  user_agent TEXT,
  verification_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for election management
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voters table
CREATE POLICY "Voters can view their own data" ON public.voters
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Voters can update their own data" ON public.voters
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for elections table (public read access)
CREATE POLICY "Anyone can view active elections" ON public.elections
  FOR SELECT USING (is_active = true);

-- RLS Policies for candidates table (public read access)
CREATE POLICY "Anyone can view candidates for active elections" ON public.candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.elections 
      WHERE elections.id = candidates.election_id 
      AND elections.is_active = true
    )
  );

-- RLS Policies for votes table (voters can only see their own votes)
CREATE POLICY "Voters can view their own votes" ON public.votes
  FOR SELECT USING (auth.uid()::text = voter_id::text);

CREATE POLICY "Voters can insert their own votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid()::text = voter_id::text);

-- RLS Policies for vote_verification table
CREATE POLICY "Voters can view their own vote verification" ON public.vote_verification
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.votes 
      WHERE votes.id = vote_verification.vote_id 
      AND auth.uid()::text = votes.voter_id::text
    )
  );

-- RLS Policies for admin_users table
CREATE POLICY "Admins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users admin_check
      WHERE admin_check.email = auth.jwt() ->> 'email'
      AND admin_check.is_active = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_voters_voter_id ON public.voters(voter_id);
CREATE INDEX IF NOT EXISTS idx_voters_aadhaar ON public.voters(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_elections_active ON public.elections(is_active);
CREATE INDEX IF NOT EXISTS idx_candidates_election ON public.candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election_voter ON public.votes(election_id, voter_id);
CREATE INDEX IF NOT EXISTS idx_votes_blockchain_hash ON public.votes(blockchain_hash);
