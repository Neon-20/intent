'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/lib/database.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteJob, toggleJobStatus } from './actions'
import { formatRelativeTime } from '@/lib/jobs-utils'

type Job = Database['public']['Tables']['jobs']['Row'] & {
  applications: { count: number }[]
}

interface JobsTableProps {
  jobs: Job[]
  categories: string[]
  jobTypes: string[]
}

export function JobsTable({ jobs, categories, jobTypes }: JobsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/jobs?${params.toString()}`)
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    setDeletingId(jobId)
    const result = await deleteJob(jobId)
    setDeletingId(null)

    if (!result.success) {
      alert(result.error || 'Failed to delete job')
    } else {
      router.refresh()
    }
  }

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    setTogglingId(jobId)
    const result = await toggleJobStatus(jobId, !currentStatus)
    setTogglingId(null)

    if (!result.success) {
      alert(result.error || 'Failed to update job status')
    } else {
      router.refresh()
    }
  }

  const currentStatus = searchParams.get('status') || 'all'
  const currentCategory = searchParams.get('category') || 'all'
  const currentJobType = searchParams.get('job_type') || 'all'

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="w-48">
          <Select value={currentStatus} onValueChange={(v) => handleFilterChange('status', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={currentCategory} onValueChange={(v) => handleFilterChange('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={currentJobType} onValueChange={(v) => handleFilterChange('job_type', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No jobs found. Create your first job posting!
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => {
                const applicationsCount = job.applications?.[0]?.count || 0

                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.experience_level}</TableCell>
                    <TableCell>
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatRelativeTime(job.posted_at)}</TableCell>
                    <TableCell>{applicationsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                        >
                          <Link href={`/admin/jobs/${job.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleToggleStatus(job.id, job.is_active)}
                          disabled={togglingId === job.id}
                        >
                          {job.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

