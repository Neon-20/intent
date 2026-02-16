'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'

type Application = Database['public']['Tables']['applications']['Row']
type Job = Database['public']['Tables']['jobs']['Row']

export type ApplicationWithJob = Application & {
  job: Job | null
}

export async function getApplications() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(*)
    `)
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    throw new Error('Failed to fetch applications')
  }

  return data as ApplicationWithJob[]
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  const supabase = await createClient()

  // TODO: Email Notifications
  // Fetch application details to get applicant email
  // const { data: application } = await supabase
  //   .from('applications')
  //   .select('email, applicant_name, job:jobs(title)')
  //   .eq('id', applicationId)
  //   .single()
  //
  // Send status update email to applicant based on new status
  // Example: await sendEmail({
  //   to: application.email,
  //   subject: `Application Status Update - ${application.job.title}`,
  //   body: `Your application status has been updated to: ${status}`
  // })

  const { error } = await (supabase as any)
    .from('applications')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application status:', error)
    throw new Error('Failed to update application status')
  }

  revalidatePath('/admin/applications')
  return { success: true }
}

export async function updateApplicationNotes(
  applicationId: string,
  notes: string
) {
  const supabase = await createClient()

  const { error } = await (supabase as any)
    .from('applications')
    .update({
      admin_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application notes:', error)
    throw new Error('Failed to update application notes')
  }

  revalidatePath('/admin/applications')
  return { success: true }
}

export async function getResumeDownloadUrl(resumePath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .storage
    .from('resumes')
    .createSignedUrl(resumePath, 60) // URL valid for 60 seconds

  if (error) {
    console.error('Error creating signed URL:', error)
    throw new Error('Failed to create download URL')
  }

  return data.signedUrl
}

