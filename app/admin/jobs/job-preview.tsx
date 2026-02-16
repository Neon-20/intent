'use client'

import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, Briefcase, TrendingUp, DollarSign } from 'lucide-react'

interface JobPreviewProps {
  title: string
  company: string
  location: string
  jobType: string
  experienceLevel: string
  salaryRange?: string
  description: string
  requirements?: string
  skills: string[]
  logoUrl?: string | null
}

export function JobPreview({
  title,
  company,
  location,
  jobType,
  experienceLevel,
  salaryRange,
  description,
  requirements,
  skills,
  logoUrl,
}: JobPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={`${company} logo`}
                className="h-16 w-16 object-contain rounded border"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{title || 'Job Title'}</h1>
              <p className="text-xl text-muted-foreground mt-1">
                {company || 'Company Name'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </div>
            )}
            {jobType && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {jobType}
              </div>
            )}
            {experienceLevel && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {experienceLevel}
              </div>
            )}
            {salaryRange && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {salaryRange}
              </div>
            )}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About the Role</h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
            </div>
          )}

          {requirements && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{requirements}</ReactMarkdown>
              </div>
            </div>
          )}

          {!description && !requirements && (
            <p className="text-muted-foreground italic text-center py-8">
              No content to preview. Start filling out the form to see how your job posting will look.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

