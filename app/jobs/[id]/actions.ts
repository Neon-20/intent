'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'

type ApplicationInsert = Database['public']['Tables']['applications']['Insert']

export async function submitApplication(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract form data
    const jobId = formData.get('job_id') as string
    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string | null
    const coverLetter = formData.get('cover_letter') as string | null
    const resumeFile = formData.get('resume') as File

    if (!jobId || !fullName || !email || !resumeFile) {
      return { success: false, error: 'Missing required fields' }
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(resumeFile.type)) {
      return { success: false, error: 'Invalid file type. Please upload PDF, DOC, or DOCX' }
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (resumeFile.size > maxSize) {
      return { success: false, error: 'File size exceeds 10MB limit' }
    }

    // Upload resume to Supabase Storage
    const fileExt = resumeFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${jobId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile, {
        contentType: resumeFile.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Failed to upload resume' }
    }

    // Get the public URL for the resume
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath)

    // Insert application into database
    const { error: insertError } = await (supabase as any)
      .from('applications')
      .insert({
        job_id: jobId,
        applicant_name: fullName,
        email,
        phone: phone || null,
        cover_letter: coverLetter || null,
        resume_url: publicUrl,
        status: 'pending',
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      // Try to clean up uploaded file
      await supabase.storage.from('resumes').remove([filePath])
      return { success: false, error: 'Failed to submit application' }
    }

    // Revalidate the job page
    revalidatePath(`/jobs/${jobId}`)

    // TODO: Email Notifications
    // Send email notification to admin about new application
    // Example: await sendEmail({
    //   to: 'admin@steppingstones.com',
    //   subject: `New Application for ${jobTitle}`,
    //   body: `${fullName} (${email}) has applied for the position.`
    // })
    //
    // Send confirmation email to applicant
    // Example: await sendEmail({
    //   to: email,
    //   subject: 'Application Received',
    //   body: `Thank you for applying! We'll review your application and get back to you soon.`
    // })

    return { success: true }
  } catch (error) {
    console.error('Application submission error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

