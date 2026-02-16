import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import ReactMarkdown from 'react-markdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Building2,
  ExternalLink,
  Share2
} from 'lucide-react'
import { ApplicationForm } from './application-form'
import { ShareButton } from './share-button'
import { RelatedJobs } from './related-jobs'

type Job = Database['public']['Tables']['jobs']['Row']

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single<Job>()

  if (!job) {
    return {
      title: 'Job Not Found',
    }
  }

  const title = `${job.title} at ${job.company} | Stepping Stones`
  const description = job.description.substring(0, 160)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: job.logo_url ? [job.logo_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single<Job>()

  if (error || !job) {
    notFound()
  }

  // Generate JobPosting structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    employmentType: job.job_type.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      logo: job.logo_url,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    ...(job.salary_range && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary_range,
        },
      },
    }),
  }

  // TODO: Analytics - Track job view
  // Increment job_views counter in database when page loads
  // Example: await supabase.rpc('increment_job_views', { job_id: job.id })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium">{job.company}</span>
                </div>
              </div>
              <ShareButton jobId={job.id} jobTitle={job.title} />
            </div>

            {/* Job Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{job.job_type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{job.experience_level}</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{job.description}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{job.requirements}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this position</CardTitle>
                </CardHeader>
                <CardContent>
                  {job.apply_url ? (
                    // TODO: Analytics - Track external apply clicks
                    // Add onClick handler to track when users click external apply links
                    // Example: onClick={() => trackApplyClick(job.id, 'external')}
                    <Button asChild className="w-full" size="lg">
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <ApplicationForm jobId={job.id} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Jobs */}
          <div className="mt-12">
            <RelatedJobs
              currentJobId={job.id}
              company={job.company}
              experienceLevel={job.experience_level}
            />
          </div>
        </div>
      </div>
    </>
  )
}

