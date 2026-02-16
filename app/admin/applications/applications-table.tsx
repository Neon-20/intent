'use client'

import { useState, useMemo } from 'react'
import { ApplicationWithJob } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApplicationDetail } from './application-detail'
import { Download, Search, Filter } from 'lucide-react'

interface ApplicationsTableProps {
  applications: ApplicationWithJob[]
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0]
}

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  reviewing: 'default',
  shortlisted: 'outline',
  rejected: 'destructive',
  hired: 'default',
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [jobFilter, setJobFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Get unique jobs for filter
  const uniqueJobs = useMemo(() => {
    const jobsMap = new Map()
    applications.forEach(app => {
      if (app.job) {
        jobsMap.set(app.job.id, app.job)
      }
    })
    return Array.from(jobsMap.values())
  }, [applications])

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        app.applicant_name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.job?.title.toLowerCase().includes(searchLower)

      // Status filter
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter

      // Job filter
      const matchesJob = jobFilter === 'all' || app.job_id === jobFilter

      // Date filter
      const appDate = new Date(app.submitted_at)
      const matchesDateFrom = !dateFrom || appDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || appDate <= new Date(dateTo)

      return matchesSearch && matchesStatus && matchesJob && matchesDateFrom && matchesDateTo
    })
  }, [applications, searchQuery, statusFilter, jobFilter, dateFrom, dateTo])

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Applicant Name', 'Email', 'Job Title', 'Status', 'Submitted Date', 'Phone', 'LinkedIn', 'Portfolio']
    const rows = filteredApplications.map(app => [
      app.applicant_name,
      app.email,
      app.job?.title || 'N/A',
      app.status,
      formatDate(new Date(app.submitted_at)),
      app.phone || '',
      app.linkedin_url || '',
      app.portfolio_url || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications-${formatDateForFilename(new Date())}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {uniqueJobs.map(job => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 size-4" />
          Export CSV
        </Button>
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Date Range:</span>
        </div>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full md:w-[180px]"
          placeholder="From"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full md:w-[180px]"
          placeholder="To"
        />
        {(dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateFrom('')
              setDateTo('')
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedApplication(application)}
                >
                  <TableCell className="font-medium">
                    {application.applicant_name}
                  </TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>{application.job?.title || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[application.status] || 'default'}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(new Date(application.submitted_at))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedApplication(application)
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      {selectedApplication && (
        <ApplicationDetail
          application={selectedApplication}
          open={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  )
}

