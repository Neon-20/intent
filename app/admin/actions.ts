"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export interface DashboardStats {
  totalActiveJobs: number
  totalApplications: {
    total: number
    new: number
    reviewed: number
    shortlisted: number
  }
  totalResumeRequests: {
    total: number
    pending: number
    inProgress: number
    completed: number
  }
  jobsExpiringSoon: number
}

export interface RecentApplication {
  id: string
  applicant_name: string
  email: string
  job_title: string
  status: string
  submitted_at: string
}

export interface RecentResumeRequest {
  id: string
  full_name: string
  email: string
  service_type: string
  status: string
  submitted_at: string
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient()

  // Get total active jobs
  const { count: activeJobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get applications by status
  const { data: applications } = await supabase
    .from('applications')
    .select('id, status')

  const applicationStats = {
    total: applications?.length || 0,
    new: applications?.filter((a: any) => a.status === 'pending').length || 0,
    reviewed: applications?.filter((a: any) => a.status === 'reviewing').length || 0,
    shortlisted: applications?.filter((a: any) => a.status === 'shortlisted').length || 0,
  }

  // Get resume requests by status
  const { data: resumeRequests } = await supabase
    .from('resume_requests')
    .select('id, status')

  const resumeRequestStats = {
    total: resumeRequests?.length || 0,
    pending: resumeRequests?.filter((r: any) => r.status === 'pending').length || 0,
    inProgress: resumeRequests?.filter((r: any) => r.status === 'in-progress').length || 0,
    completed: resumeRequests?.filter((r: any) => r.status === 'completed').length || 0,
  }

  // Get jobs expiring soon (posted more than 25 days ago, assuming 30-day expiry)
  const twentyFiveDaysAgo = new Date()
  twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25)

  const { count: expiringSoonCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .lt('posted_at', twentyFiveDaysAgo.toISOString())

  return {
    totalActiveJobs: activeJobsCount || 0,
    totalApplications: applicationStats,
    totalResumeRequests: resumeRequestStats,
    jobsExpiringSoon: expiringSoonCount || 0,
  }
}

export async function getRecentApplications(limit: number = 10): Promise<RecentApplication[]> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('applications')
    .select(`
      id,
      applicant_name,
      email,
      status,
      submitted_at,
      jobs (
        title
      )
    `)
    .order('submitted_at', { ascending: false })
    .limit(limit)

  return ((data || []) as any[]).map((app: any) => ({
    id: app.id,
    applicant_name: app.applicant_name,
    email: app.email,
    job_title: app.jobs?.title || 'Unknown Job',
    status: app.status,
    submitted_at: app.submitted_at,
  }))
}

export async function getRecentResumeRequests(limit: number = 10): Promise<RecentResumeRequest[]> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('resume_requests')
    .select('id, full_name, email, service_type, status, submitted_at')
    .order('submitted_at', { ascending: false })
    .limit(limit)

  return data || []
}

