'use client'

import { useState, useTransition } from 'react'
import { ApplicationWithJob, updateApplicationStatus, updateApplicationNotes, getResumeDownloadUrl } from './actions'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
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
import { Download, Mail, Phone, Linkedin, Globe, FileText, Loader2 } from 'lucide-react'

interface ApplicationDetailProps {
  application: ApplicationWithJob
  open: boolean
  onClose: () => void
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
]

export function ApplicationDetail({ application, open, onClose }: ApplicationDetailProps) {
  const [status, setStatus] = useState(application.status)
  const [notes, setNotes] = useState(application.admin_notes || '')
  const [isPending, startTransition] = useTransition()
  const [isDownloading, setIsDownloading] = useState(false)

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    startTransition(async () => {
      try {
        await updateApplicationStatus(application.id, newStatus)
      } catch (error) {
        console.error('Failed to update status:', error)
        setStatus(application.status) // Revert on error
      }
    })
  }

  const handleNotesUpdate = () => {
    startTransition(async () => {
      try {
        await updateApplicationNotes(application.id, notes)
      } catch (error) {
        console.error('Failed to update notes:', error)
      }
    })
  }

  const handleDownloadResume = async () => {
    if (!application.resume_url) return
    
    setIsDownloading(true)
    try {
      const url = await getResumeDownloadUrl(application.resume_url)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Failed to download resume:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Application Details</SheetTitle>
          <SheetDescription>
            View and manage application from {application.applicant_name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Applicant Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Applicant Information</h3>
            
            <div className="grid gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="text-base font-medium">{application.applicant_name}</p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <a href={`mailto:${application.email}`} className="text-primary hover:underline">
                  {application.email}
                </a>
              </div>

              {application.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <a href={`tel:${application.phone}`} className="text-primary hover:underline">
                    {application.phone}
                  </a>
                </div>
              )}

              {application.linkedin_url && (
                <div className="flex items-center gap-2">
                  <Linkedin className="size-4 text-muted-foreground" />
                  <a 
                    href={application.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}

              {application.portfolio_url && (
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-muted-foreground" />
                  <a 
                    href={application.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Job Applied For</h3>
            <p className="text-base font-medium">{application.job?.title || 'N/A'}</p>
            {application.job?.company && (
              <p className="text-sm text-muted-foreground">{application.job.company}</p>
            )}
          </div>

          {/* Cover Letter */}
          {application.cover_letter && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Cover Letter</h3>
              <div className="rounded-md border p-4 bg-muted/50">
                <p className="text-sm whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
            </div>
          )}

          {/* Resume */}
          {application.resume_url && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Resume</h3>
              <Button
                onClick={handleDownloadResume}
                variant="outline"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 size-4" />
                    Download Resume
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Status Management */}
          <div className="space-y-2">
            <Label htmlFor="status">Application Status</Label>
            <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this application..."
              rows={5}
            />
            <Button
              onClick={handleNotesUpdate}
              disabled={isPending || notes === (application.admin_notes || '')}
              size="sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Notes'
              )}
            </Button>
          </div>

          {/* Metadata */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground">Metadata</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{new Date(application.submitted_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(application.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

