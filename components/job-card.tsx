import Link from 'next/link'
import { Building2, MapPin, Clock, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { JobCardProps } from '@/types/jobs'
import { formatRelativeTime } from '@/lib/jobs-utils'

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="relative p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 bg-gradient-to-br from-background to-primary/5 overflow-hidden group">
        {/* Decorative gradient corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {job.logo_url ? (
              <img
                src={job.logo_url}
                alt={`${job.company} logo`}
                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-600 flex-shrink-0">
                  <DollarSign className="w-4 h-4" />
                  {job.salary_range}
                </div>
              )}
            </div>

            {/* Location and Type Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </Badge>
              <Badge variant="outline">{job.job_type}</Badge>
              <Badge variant="outline">{job.experience_level}</Badge>
              <Badge variant="outline">{job.category}</Badge>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {job.skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gradient-to-r from-primary/15 to-primary/10 text-primary rounded-md hover:from-primary/20 hover:to-primary/15 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 5 && (
                  <span className="text-xs px-2 py-1 text-muted-foreground">
                    +{job.skills.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Posted Date */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(job.posted_at)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function JobCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded animate-pulse w-20" />
            <div className="h-6 bg-muted rounded animate-pulse w-20" />
            <div className="h-6 bg-muted rounded animate-pulse w-20" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-6 bg-muted rounded animate-pulse w-16" />
            <div className="h-6 bg-muted rounded animate-pulse w-16" />
            <div className="h-6 bg-muted rounded animate-pulse w-16" />
          </div>
          <div className="h-3 bg-muted rounded animate-pulse w-24" />
        </div>
      </div>
    </Card>
  )
}

