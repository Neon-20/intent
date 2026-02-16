# Supabase Database Setup

This directory contains SQL migration files for the Stepping Stones job portal database.

## Database Schema

The database includes the following tables:

### Tables

1. **admin_users** - Admin user accounts for authentication
   - `id` (UUID, primary key)
   - `email` (text, unique)
   - `full_name` (text)
   - `created_at`, `updated_at` (timestamps)

2. **jobs** - Job postings
   - `id` (UUID, primary key)
   - `title`, `company`, `description`, `requirements` (text)
   - `category`, `job_type`, `experience_level`, `location` (text)
   - `salary_range` (text, optional)
   - `skills` (text array)
   - `apply_url` (text, optional - for external applications)
   - `logo_url` (text, optional - path to company logo)
   - `is_active` (boolean)
   - `posted_at`, `created_at`, `updated_at` (timestamps)

3. **applications** - Job applications submitted by candidates
   - `id` (UUID, primary key)
   - `job_id` (UUID, foreign key to jobs)
   - `applicant_name`, `email` (text)
   - `phone`, `resume_url`, `cover_letter`, `linkedin_url`, `portfolio_url` (text, optional)
   - `status` (text: pending, reviewing, shortlisted, rejected, hired)
   - `admin_notes` (text, optional)
   - `submitted_at`, `created_at`, `updated_at` (timestamps)

4. **resume_requests** - Resume review/writing service requests
   - `id` (UUID, primary key)
   - `full_name`, `email` (text)
   - `phone`, `current_resume_url`, `message` (text, optional)
   - `service_type` (text: resume-review, resume-writing, linkedin-optimization, career-coaching)
   - `status` (text: pending, in-progress, completed, cancelled)
   - `admin_notes` (text, optional)
   - `submitted_at`, `created_at`, `updated_at` (timestamps)

### Storage Buckets

1. **company-logos** (public)
   - Max file size: 5MB
   - Allowed types: JPEG, PNG, WebP, SVG
   - Public read access
   - Admin-only write access

2. **resumes** (private)
   - Max file size: 10MB
   - Allowed types: PDF, DOC, DOCX
   - Public can upload (for applications/requests)
   - Admin-only read/delete access

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public access**: Can read active jobs, submit applications and resume requests
- **Admin access**: Full CRUD on all tables (requires entry in admin_users table)

## Running the Migration

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/20260216000000_initial_schema.sql`
4. Run the query

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Creating the First Admin User

After running the migration, create your first admin user:

1. Create a user in Supabase Auth (Dashboard > Authentication > Users)
2. Note the user's UUID
3. Insert into admin_users table:

```sql
INSERT INTO admin_users (id, email, full_name)
VALUES ('user-uuid-from-auth', 'admin@example.com', 'Admin Name');
```

## Generating TypeScript Types

The TypeScript types are already provided in `lib/database.types.ts`. To regenerate them from your live database:

```bash
supabase gen types typescript --project-id your-project-ref > lib/database.types.ts
```

## Environment Variables

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

