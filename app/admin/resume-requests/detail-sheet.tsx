'use client'

import { useState } from 'react'
import { Database } from '@/lib/database.types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Loader2, Mail, Phone, Calendar, FileText } from 'lucide-react'
import { updateResumeRequestStatus, updateResumeRequestNotes, getResumeDownloadUrl } from './actions'
import { format } from 'date-fns'

type ResumeRequest = Database['public']['Tables']['resume_requests']['Row']

interface DetailSheetProps {
  request: ResumeRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function DetailSheet({ request, open, onOpenChange }: DetailSheetProps) {
  const [status, setStatus] = useState(request?.status || 'pending')
  const [notes, setNotes] = useState(request?.admin_notes || '')
  const [isSavingStatus, setIsSavingStatus] = useState(false)
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  if (!request) return null

  const handleStatusChange = async (newStatus: string) => {
    setIsSavingStatus(true)
    const result = await updateResumeRequestStatus(
      request.id,
      newStatus as 'pending' | 'in-progress' | 'completed' | 'cancelled'
    )
    setIsSavingStatus(false)

    if (result.success) {
      setStatus(newStatus)
    } else {
      alert(result.error || 'Failed to update status')
    }
  }

  const handleSaveNotes = async () => {
    setIsSavingNotes(true)
    const result = await updateResumeRequestNotes(request.id, notes)
    setIsSavingNotes(false)

    if (!result.success) {
      alert(result.error || 'Failed to save notes')
    }
  }

  const handleDownloadResume = async () => {
    if (!request.current_resume_url) return

    setIsDownloading(true)
    const result = await getResumeDownloadUrl(request.current_resume_url)
    setIsDownloading(false)

    if (result.success && result.url) {
      window.open(result.url, '_blank')
    } else {
      alert(result.error || 'Failed to download resume')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Resume Request Details</SheetTitle>
          <SheetDescription>
            View and manage this resume service request
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Contact Information</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{request.full_name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                  {request.email}
                </a>
              </div>
              
              {request.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                    {request.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Submitted {format(new Date(request.submitted_at), 'PPP')}
                </span>
              </div>
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Badge variant="outline" className="text-sm">
              {serviceTypeLabels[request.service_type as keyof typeof serviceTypeLabels] || request.service_type}
            </Badge>
          </div>

          {/* Message */}
          {request.message && (
            <div className="space-y-2">
              <Label>Message</Label>
              <div className="text-sm p-3 bg-muted rounded-md">
                {request.message}
              </div>
            </div>
          )}

          {/* Resume Download */}
          {request.current_resume_url && (
            <div className="space-y-2">
              <Label>Current Resume</Label>
              <Button
                onClick={handleDownloadResume}
                disabled={isDownloading}
                variant="outline"
                className="w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isSavingStatus}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="admin-notes">Admin Notes</Label>
            <Textarea
              id="admin-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this request..."
              rows={6}
            />
            <Button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full"
            >
              {isSavingNotes ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Notes'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

