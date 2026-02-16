// Utility functions for jobs filtering and URL params

import { JobFilters, Job, WorkStyle } from '@/types/jobs'

/**
 * Parse URL search params into JobFilters object
 */
export function parseFiltersFromParams(searchParams: URLSearchParams): JobFilters {
  const filters: JobFilters = {}

  const search = searchParams.get('search')
  if (search) filters.search = search

  const workStyle = searchParams.getAll('workStyle')
  if (workStyle.length > 0) filters.workStyle = workStyle as WorkStyle[]

  const jobType = searchParams.getAll('jobType')
  if (jobType.length > 0) filters.jobType = jobType as any[]

  const experienceLevel = searchParams.getAll('experienceLevel')
  if (experienceLevel.length > 0) filters.experienceLevel = experienceLevel as any[]

  const category = searchParams.getAll('category')
  if (category.length > 0) filters.category = category

  const salaryMin = searchParams.get('salaryMin')
  if (salaryMin) filters.salaryMin = parseInt(salaryMin, 10)

  const salaryMax = searchParams.get('salaryMax')
  if (salaryMax) filters.salaryMax = parseInt(salaryMax, 10)

  const sortBy = searchParams.get('sortBy')
  if (sortBy === 'recent' || sortBy === 'featured') filters.sortBy = sortBy

  return filters
}

/**
 * Convert JobFilters object to URL search params
 */
export function filtersToParams(filters: JobFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set('search', filters.search)
  
  filters.workStyle?.forEach(ws => params.append('workStyle', ws))
  filters.jobType?.forEach(jt => params.append('jobType', jt))
  filters.experienceLevel?.forEach(el => params.append('experienceLevel', el))
  filters.category?.forEach(cat => params.append('category', cat))

  if (filters.salaryMin !== undefined) params.set('salaryMin', filters.salaryMin.toString())
  if (filters.salaryMax !== undefined) params.set('salaryMax', filters.salaryMax.toString())
  if (filters.sortBy) params.set('sortBy', filters.sortBy)

  return params
}

/**
 * Determine work style from location string
 */
export function getWorkStyleFromLocation(location: string): WorkStyle {
  const lower = location.toLowerCase()
  if (lower.includes('remote')) return 'Remote'
  if (lower.includes('hybrid')) return 'Hybrid'
  return 'On-site'
}

/**
 * Parse salary range string to min/max numbers
 * Examples: "$50k - $80k", "$100,000 - $150,000", "$60k+"
 */
export function parseSalaryRange(salaryRange: string | null): { min: number; max: number | null } {
  if (!salaryRange) return { min: 0, max: null }

  // Remove currency symbols and normalize
  const normalized = salaryRange.replace(/[$,]/g, '').toLowerCase()

  // Handle "X+" format
  if (normalized.includes('+')) {
    const min = parseInt(normalized.replace(/[^0-9]/g, ''), 10)
    return { min: min * (normalized.includes('k') ? 1000 : 1), max: null }
  }

  // Handle "X - Y" format
  const parts = normalized.split('-').map(p => p.trim())
  if (parts.length === 2) {
    const min = parseInt(parts[0].replace(/[^0-9]/g, ''), 10)
    const max = parseInt(parts[1].replace(/[^0-9]/g, ''), 10)
    return {
      min: min * (parts[0].includes('k') ? 1000 : 1),
      max: max * (parts[1].includes('k') ? 1000 : 1),
    }
  }

  return { min: 0, max: null }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date()
  const posted = new Date(date)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

