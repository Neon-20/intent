-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  category TEXT NOT NULL,
  job_type TEXT NOT NULL, -- Full-time, Part-time, Contract, Internship
  experience_level TEXT NOT NULL, -- Entry, Mid, Senior, Lead
  location TEXT NOT NULL,
  salary_range TEXT,
  skills TEXT[] DEFAULT '{}',
  apply_url TEXT, -- External apply URL (e.g., Mercor referral link)
  logo_url TEXT, -- Path to company logo in storage
  is_active BOOLEAN DEFAULT true,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT, -- Path to resume in storage
  cover_letter TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewing, shortlisted, rejected, hired
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resume_requests table
CREATE TABLE resume_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL, -- resume-review, resume-writing, linkedin-optimization, career-coaching
  current_resume_url TEXT, -- Path to current resume in storage
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, in-progress, completed, cancelled
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at DESC);
CREATE INDEX idx_resume_requests_status ON resume_requests(status);
CREATE INDEX idx_resume_requests_service_type ON resume_requests(service_type);
CREATE INDEX idx_resume_requests_submitted_at ON resume_requests(submitted_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_requests_updated_at BEFORE UPDATE ON resume_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
-- Only authenticated admin users can read their own data
CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  USING (auth.uid()::text = id::text);

-- RLS Policies for jobs
-- Public can read active jobs
CREATE POLICY "Public can read active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);

-- Authenticated admin users can read all jobs
CREATE POLICY "Admin users can read all jobs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can insert jobs
CREATE POLICY "Admin users can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can update jobs
CREATE POLICY "Admin users can update jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can delete jobs
CREATE POLICY "Admin users can delete jobs"
  ON jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- RLS Policies for applications
-- Anyone can insert applications (public job applications)
CREATE POLICY "Anyone can insert applications"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Authenticated admin users can read all applications
CREATE POLICY "Admin users can read all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can update applications
CREATE POLICY "Admin users can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can delete applications
CREATE POLICY "Admin users can delete applications"
  ON applications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- RLS Policies for resume_requests
-- Anyone can insert resume requests (public service requests)
CREATE POLICY "Anyone can insert resume requests"
  ON resume_requests FOR INSERT
  WITH CHECK (true);

-- Authenticated admin users can read all resume requests
CREATE POLICY "Admin users can read all resume requests"
  ON resume_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can update resume requests
CREATE POLICY "Admin users can update resume requests"
  ON resume_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Authenticated admin users can delete resume requests
CREATE POLICY "Admin users can delete resume requests"
  ON resume_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for company-logos bucket (public)
CREATE POLICY "Public can view company logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

CREATE POLICY "Admin users can upload company logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-logos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admin users can update company logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'company-logos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admin users can delete company logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-logos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

-- Storage policies for resumes bucket (private)
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Admin users can view resumes"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Admin users can delete resumes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id::text = auth.uid()::text
    )
  );

