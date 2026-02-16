'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateResumeRequestStatus(
  requestId: string,
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
) {
  try {
    const supabase = await createClient()

    // TODO: Email Notifications
    // Fetch request details to get user email
    // const { data: request } = await supabase
    //   .from('resume_requests')
    //   .select('email, full_name, service_type')
    //   .eq('id', requestId)
    //   .single()
    //
    // Send status update email to user based on new status
    // Example: await sendEmail({
    //   to: request.email,
    //   subject: `Resume Review Status Update - ${request.service_type}`,
    //   body: `Your resume review status has been updated to: ${status}`
    // })

    const { error } = await (supabase as any)
      .from('resume_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) {
      console.error('Error updating status:', error)
      return { success: false, error: 'Failed to update status' }
    }

    revalidatePath('/admin/resume-requests')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateResumeRequestNotes(
  requestId: string,
  adminNotes: string
) {
  try {
    const supabase = await createClient()

    const { error } = await (supabase as any)
      .from('resume_requests')
      .update({
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) {
      console.error('Error updating notes:', error)
      return { success: false, error: 'Failed to update notes' }
    }

    revalidatePath('/admin/resume-requests')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getResumeDownloadUrl(resumePath: string | null) {
  if (!resumePath) {
    return { success: false, error: 'No resume available' }
  }

  try {
    const supabase = await createClient()

    // Extract the path from the full URL if needed
    const path = resumePath.includes('/') 
      ? resumePath.split('/').slice(-2).join('/')
      : resumePath

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(path, 3600) // 1 hour expiry

    if (error) {
      console.error('Error creating signed URL:', error)
      return { success: false, error: 'Failed to generate download link' }
    }

    return { success: true, url: data.signedUrl }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

