'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface FiltersProps {
  onFilterChange: (filters: { serviceType?: string; status?: string }) => void
}

export function Filters({ onFilterChange }: FiltersProps) {
  const [serviceType, setServiceType] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const handleServiceTypeChange = (value: string) => {
    const newValue = value === 'all' ? '' : value
    setServiceType(newValue)
    onFilterChange({ serviceType: newValue, status })
  }

  const handleStatusChange = (value: string) => {
    const newValue = value === 'all' ? '' : value
    setStatus(newValue)
    onFilterChange({ serviceType, status: newValue })
  }

  const handleClearFilters = () => {
    setServiceType('')
    setStatus('')
    onFilterChange({ serviceType: '', status: '' })
  }

  const hasActiveFilters = serviceType || status

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="service-type-filter">Service Type</Label>
        <Select value={serviceType || 'all'} onValueChange={handleServiceTypeChange}>
          <SelectTrigger id="service-type-filter" className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="resume-review">Resume Review</SelectItem>
            <SelectItem value="resume-writing">Resume Writing</SelectItem>
            <SelectItem value="linkedin-optimization">LinkedIn Optimization</SelectItem>
            <SelectItem value="career-coaching">Career Coaching</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <Label htmlFor="status-filter">Status</Label>
        <Select value={status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger id="status-filter" className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="whitespace-nowrap"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}

