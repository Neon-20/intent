import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, DollarSign } from 'lucide-react'
import Link from 'next/link'

type Job = Database['public']['Tables']['jobs']['Row']

interface RelatedJobsProps {
  currentJobId: string
  company: string
  experienceLevel: string
}

export async function RelatedJobs({ 
  currentJobId, 
  company,
  experienceLevel 
}: RelatedJobsProps) {
  const supabase = await createClient()

  // Fetch related jobs (same company or same experience level)
  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .neq('id', currentJobId)
    .or(`company.eq.${company},experience_level.eq.${experienceLevel}`)
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<Job[]>()

  if (!relatedJobs || relatedJobs.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedJobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="line-clamp-2">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  {job.company}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="capitalize">{job.job_type}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

