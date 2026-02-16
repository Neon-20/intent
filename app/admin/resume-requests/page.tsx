import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { ResumeRequestsTable } from './table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ResumeRequest = Database['public']['Tables']['resume_requests']['Row']

export const metadata = {
  title: 'Resume Requests - Admin',
  description: 'Manage resume service requests',
}

async function getResumeRequests() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('resume_requests')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching resume requests:', error)
    return []
  }

  return data as ResumeRequest[]
}

export default async function ResumeRequestsPage() {
  const requests = await getResumeRequests()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track resume service requests
        </p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            {requests.length} total request{requests.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ResumeRequestsTable requests={requests} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

