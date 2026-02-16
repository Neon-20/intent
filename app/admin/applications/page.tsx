import { Metadata } from 'next'
import { getApplications } from './actions'
import { ApplicationsTable } from './applications-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Applications Management | Admin',
  description: 'Manage job applications',
}

export default async function ApplicationsPage() {
  const applications = await getApplications()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
          <FileText className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications Management</h1>
          <p className="text-muted-foreground">
            View and manage all job applications
          </p>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{applications.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl">
                {applications.filter(a => a.status === 'pending').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reviewing</CardDescription>
              <CardTitle className="text-3xl">
                {applications.filter(a => a.status === 'reviewing').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Shortlisted</CardDescription>
              <CardTitle className="text-3xl">
                {applications.filter(a => a.status === 'shortlisted').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              Click on any row to view full application details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationsTable applications={applications} />
          </CardContent>
        </Card>
    </div>
  )
}

