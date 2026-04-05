-- Users table (synced from Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Repurposes table
CREATE TABLE repurposes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id),
  input_text TEXT NOT NULL,
  input_source TEXT,
  source_url TEXT,
  tone TEXT DEFAULT 'professional',
  outputs JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for monthly usage counting
CREATE INDEX idx_repurposes_user_month
  ON repurposes (user_id, created_at);
