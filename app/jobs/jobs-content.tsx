'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { JobsFilters } from '@/components/jobs-filters'
import { JobCard } from '@/components/job-card'
import { Job, JobFilters } from '@/types/jobs'
import { parseFiltersFromParams, filtersToParams, getWorkStyleFromLocation, parseSalaryRange } from '@/lib/jobs-utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface JobsContentProps {
  initialJobs: Job[]
  categories: string[]
  searchParams: { [key: string]: string | string[] | undefined }
}

export function JobsContent({ initialJobs, categories, searchParams }: JobsContentProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  // Add animation key that changes on mount to trigger animations on refresh
  const [animationKey, setAnimationKey] = useState(0)

  // Sidebar collapse state - default to collapsed (closed)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  // Parse initial filters from URL
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value) {
        params.set(key, value)
      }
    })
    return parseFiltersFromParams(params)
  }, [searchParams])

  const [filters, setFilters] = useState<JobFilters>(initialFilters)

  // Reset animation key when filters change to re-trigger animations
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [filters])

  // Update URL when filters change
  useEffect(() => {
    const params = filtersToParams(filters)
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs'
    router.push(newUrl, { scroll: false })
  }, [filters, router])

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    let result = [...initialJobs]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower))
      )
    }

    // Work style filter
    if (filters.workStyle && filters.workStyle.length > 0) {
      result = result.filter(job => {
        const workStyle = getWorkStyleFromLocation(job.location)
        return filters.workStyle!.includes(workStyle)
      })
    }

    // Job type filter
    if (filters.jobType && filters.jobType.length > 0) {
      result = result.filter(job => filters.jobType!.includes(job.job_type as any))
    }

    // Experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      result = result.filter(job => filters.experienceLevel!.includes(job.experience_level as any))
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter(job => filters.category!.includes(job.category))
    }

    // Salary range filter
    if (filters.salaryMin !== undefined || filters.salaryMax !== undefined) {
      result = result.filter(job => {
        if (!job.salary_range) return false
        const { min, max } = parseSalaryRange(job.salary_range)
        
        if (filters.salaryMin !== undefined && max !== null && max < filters.salaryMin) {
          return false
        }
        if (filters.salaryMax !== undefined && min > filters.salaryMax) {
          return false
        }
        return true
      })
    }

    // Sort
    if (filters.sortBy === 'recent') {
      result.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime())
    }

    return result
  }, [initialJobs, filters])

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value as 'recent' | 'featured' })
  }

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className={`shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'w-10' : 'w-64'
      }`}>
        <JobsFilters
          filters={filters}
          categories={categories}
          onFiltersChange={handleFiltersChange}
          totalJobs={filteredJobs.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Jobs List */}
      <div className="flex-1 min-w-0">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          <Select value={filters.sortBy || 'recent'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="featured">Featured First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <LazyJobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

function LazyJobCard({ job }: { job: Job }) {
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
    >
      <JobCard job={job} />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    </div>
  )
}

