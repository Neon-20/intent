import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

type Job = Database['public']['Tables']['jobs']['Row']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://steppingstones.com'
  const supabase = await createClient()

  // Fetch all active jobs for dynamic routes
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('is_active', true)
    .returns<Pick<Job, 'id' | 'updated_at'>[]>()

  const jobUrls = (jobs || []).map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...jobUrls,
  ]
}

