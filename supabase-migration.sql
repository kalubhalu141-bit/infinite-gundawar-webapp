-- Supabase SQL Migration
-- Run this in Supabase Dashboard → SQL Editor

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  city TEXT DEFAULT '',
  source TEXT DEFAULT 'website',
  interests TEXT DEFAULT '[]',
  message TEXT DEFAULT '',
  subscribed INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  verification_token TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_token ON leads(verification_token);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_verified ON leads(verified);

-- Email log table
CREATE TABLE IF NOT EXISTS email_log (
  id BIGSERIAL PRIMARY KEY,
  lead_id TEXT,
  email TEXT DEFAULT '',
  template TEXT DEFAULT '',
  status TEXT DEFAULT '',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  error TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_email_log_lead ON email_log(lead_id);
