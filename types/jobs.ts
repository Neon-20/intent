// Types for jobs listing and filtering

import { Database } from '@/lib/database.types'

export type Job = Database['public']['Tables']['jobs']['Row']

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead'
export type WorkStyle = 'Remote' | 'Hybrid' | 'On-site'

export interface JobFilters {
  search?: string
  workStyle?: WorkStyle[]
  jobType?: JobType[]
  experienceLevel?: ExperienceLevel[]
  category?: string[]
  salaryMin?: number
  salaryMax?: number
  sortBy?: 'recent' | 'featured'
}

export interface JobCardProps {
  job: Job
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

