# Stepping Stones — Job Portal & Career Consultancy Platform

A modern job portal and career consultancy platform built with Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Public Job Portal**: Browse and search jobs with advanced filters
- **Job Applications**: Apply to jobs with resume upload
- **Career Services**: Request resume reviews and career consultancy
- **Admin Portal**: Manage jobs, applications, and service requests
- **Modern UI**: Clean, professional design with shadcn/ui components
- **Responsive**: Mobile-friendly design

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (create one at [supabase.com](https://supabase.com))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase project details:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

Build for production:

```bash
npm run build
```

### Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   └── supabase/         # Supabase client utilities
│       ├── client.ts     # Client-side Supabase client
│       ├── server.ts     # Server-side Supabase client
│       └── admin.ts      # Admin Supabase client (service role)
├── types/                 # TypeScript type definitions
│   └── database.ts       # Database schema types
└── public/               # Static assets
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
