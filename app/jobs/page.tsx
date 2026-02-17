import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Building2, MapPin, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { JobsContent } from './jobs-content'
import { JobCardSkeleton } from '@/components/job-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Browse Jobs',
  description: 'Find your next career opportunity. Browse curated job listings with advanced filters by location, job type, experience level, and more. Discover remote, hybrid, and on-site positions.',
  keywords: ['job listings', 'job search', 'career opportunities', 'remote jobs', 'hybrid jobs', 'on-site jobs', 'job openings'],
  openGraph: {
    title: 'Browse Jobs | Stepping Stones',
    description: 'Find your next career opportunity. Browse curated job listings with advanced filters.',
    type: 'website',
    url: '/jobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Jobs | Stepping Stones',
    description: 'Find your next career opportunity. Browse curated job listings with advanced filters.',
  },
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient background */}
      <div className="relative border-b bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl opacity-30" />

        <div className="relative container mx-auto px-4 py-8">
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Stepping Stones</span>
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-6">
            {/* Left: Heading */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Find Your Next <span className="text-primary">Opportunity</span>
              </h1>
              <p className="text-muted-foreground">
                Browse curated job listings and find your perfect role
              </p>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Active Jobs</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-xs text-muted-foreground">Companies</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Remote</div>
                <div className="text-xs text-muted-foreground">Friendly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<JobsPageSkeleton />}>
          <JobsContentWrapper searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}

async function JobsContentWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()

  // Fetch all active jobs
  const { data: jobs, error } = await (supabase as any)
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('posted_at', { ascending: false })

  if (error) {
    console.error('Error fetching jobs:', error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load jobs. Please try again later.</p>
      </div>
    )
  }

  // Get unique categories from jobs
  const categories = Array.from(new Set(jobs?.map((job: any) => job.category) || [])).sort() as string[]

  return <JobsContent initialJobs={jobs || []} categories={categories} searchParams={searchParams} />
}

function JobsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Skeleton */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </div>
      </div>

      {/* Jobs List Skeleton */}
      <div className="lg:col-span-3 space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-48 mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

