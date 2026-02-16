'use client'

import { useState, useMemo } from 'react'
import { Database } from '@/lib/database.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Filters } from './filters'
import { DetailSheet } from './detail-sheet'

type ResumeRequest = Database['public']['Tables']['resume_requests']['Row']

interface ResumeRequestsTableProps {
  requests: ResumeRequest[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
}

const serviceTypeLabels = {
  'resume-review': 'Resume Review',
  'resume-writing': 'Resume Writing',
  'linkedin-optimization': 'LinkedIn Optimization',
  'career-coaching': 'Career Coaching',
}

export function ResumeRequestsTable({ requests }: ResumeRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<ResumeRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [filters, setFilters] = useState<{ serviceType?: string; status?: string }>({})

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (filters.serviceType && request.service_type !== filters.serviceType) {
        return false
      }
      if (filters.status && request.status !== filters.status) {
        return false
      }
      return true
    })
  }, [requests, filters])

  const handleRowClick = (request: ResumeRequest) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  const handleFilterChange = (newFilters: { serviceType?: string; status?: string }) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      <Filters onFilterChange={handleFilterChange} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No resume requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(request)}
                >
                  <TableCell className="font-medium">{request.full_name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {serviceTypeLabels[request.service_type as keyof typeof serviceTypeLabels] || request.service_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColors[request.status as keyof typeof statusColors] || ''}`}
                    >
                      {request.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(request.submitted_at), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredRequests.length} of {requests.length} request{requests.length !== 1 ? 's' : ''}
      </div>

      <DetailSheet
        request={selectedRequest}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}

