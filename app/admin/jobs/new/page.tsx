import { JobForm } from '../job-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function NewJobPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/jobs">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Job</h1>
          <p className="text-muted-foreground">
            Add a new job posting to your portal
          </p>
        </div>
      </div>

      <JobForm mode="create" />
    </div>
  )
}

