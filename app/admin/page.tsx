import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  FileText,
  ClipboardList,
  AlertCircle,
  Plus,
  Eye,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { getDashboardStats, getRecentApplications, getRecentResumeRequests } from "./actions"
import { formatDistanceToNow } from "date-fns"

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentApplications = await getRecentApplications(8)
  const recentResumeRequests = await getRecentResumeRequests(8)

  const statCards = [
    {
      title: "Active Jobs",
      value: stats.totalActiveJobs,
      icon: Briefcase,
      description: "Currently active job postings",
      href: "/admin/jobs",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications.total,
      icon: FileText,
      description: `${stats.totalApplications.new} new, ${stats.totalApplications.reviewed} reviewed, ${stats.totalApplications.shortlisted} shortlisted`,
      href: "/admin/applications",
    },
    {
      title: "Resume Requests",
      value: stats.totalResumeRequests.total,
      icon: ClipboardList,
      description: `${stats.totalResumeRequests.pending} pending, ${stats.totalResumeRequests.inProgress} in progress, ${stats.totalResumeRequests.completed} completed`,
      href: "/admin/resume-requests",
    },
    {
      title: "Jobs Expiring Soon",
      value: stats.jobsExpiringSoon,
      icon: AlertCircle,
      description: "Jobs posted over 25 days ago",
      href: "/admin/jobs?filter=expiring",
      variant: "warning" as const,
    },
  ]

  return (
    <div className="space-y-8">
        {/* Header with gradient background */}
        <div className="relative -mx-6 -mt-6 mb-8 px-6 pt-6 pb-8 bg-gradient-to-br from-primary/5 via-primary/3 to-background rounded-b-2xl overflow-hidden">
          {/* Decorative gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Overview of your job portal and career consultancy platform
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/admin/jobs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Job
                </Link>
              </Button>
              <Button variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                <Link href="/admin/applications">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Applications
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} href={card.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${card.variant === 'warning' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${card.variant === 'warning' && card.value > 0 ? 'text-orange-500' : ''}`}>
                      {card.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest job applications submitted</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/applications">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No applications yet
                  </p>
                ) : (
                  recentApplications.map((app) => (
                    <div key={app.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{app.applicant_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{app.job_title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(app.submitted_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant={
                        app.status === 'shortlisted' ? 'default' :
                        app.status === 'reviewing' ? 'secondary' :
                        'outline'
                      }>
                        {app.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Resume Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Resume Requests</CardTitle>
                  <CardDescription>Latest service requests submitted</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/resume-requests">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResumeRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No resume requests yet
                  </p>
                ) : (
                  recentResumeRequests.map((request) => (
                    <div key={request.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{request.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {request.service_type.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(request.submitted_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
