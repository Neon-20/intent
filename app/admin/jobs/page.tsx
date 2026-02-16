import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { JobsTable } from './jobs-table'

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('jobs')
    .select(`
      *,
      applications:applications(count)
    `, { count: 'exact' })
    .order('posted_at', { ascending: false })

  // Apply filters
  const status = params.status as string | undefined
  if (status === 'active') {
    query = query.eq('is_active', true)
  } else if (status === 'inactive') {
    query = query.eq('is_active', false)
  }

  const category = params.category as string | undefined
  if (category) {
    query = query.eq('category', category)
  }

  const jobType = params.job_type as string | undefined
  if (jobType) {
    query = query.eq('job_type', jobType)
  }

  const { data: jobs, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  // Get unique categories and job types for filters
  const { data: allJobs } = await supabase
    .from('jobs')
    .select('id, category, job_type')

  const categories = Array.from(new Set(allJobs?.map((j: any) => j.category) || [])) as string[]
  const jobTypes = Array.from(new Set(allJobs?.map((j: any) => j.job_type) || [])) as string[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">
            Manage job postings and applications
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Link>
        </Button>
      </div>

      <JobsTable
        jobs={jobs || []}
        categories={categories}
        jobTypes={jobTypes}
      />
    </div>
  )
}

