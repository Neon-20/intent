'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitServiceRequest(formData: FormData) {
  try {
    const supabase = await createClient()

    // Extract form data
    const serviceType = formData.get('service_type') as string
    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string | null
    const message = formData.get('message') as string | null
    const resumeFile = formData.get('resume') as File | null

    // Validate required fields
    if (!serviceType || !fullName || !email) {
      return { success: false, error: 'Missing required fields' }
    }

    let resumeUrl: string | null = null

    // Upload resume if provided
    if (resumeFile && resumeFile.size > 0) {
      // Generate unique filename
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `service-requests/${fileName}`

      // Upload to Supabase Storage
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

      resumeUrl = publicUrl
    }

    // Insert service request into database
    const { error: insertError } = await (supabase
      .from('resume_requests') as any)
      .insert({
        full_name: fullName,
        email,
        phone: phone || null,
        service_type: serviceType,
        current_resume_url: resumeUrl,
        message: message || null,
        status: 'pending',
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      // Try to clean up uploaded file if database insert fails
      if (resumeUrl) {
        const filePath = resumeUrl.split('/').slice(-2).join('/')
        await supabase.storage.from('resumes').remove([filePath])
      }
      return { success: false, error: 'Failed to submit service request' }
    }

    // TODO: Email Notifications
    // Send email notification to admin about new service request
    // Example: await sendEmail({
    //   to: 'admin@steppingstones.com',
    //   subject: `New ${serviceType} Request`,
    //   body: `${fullName} (${email}) has requested ${serviceType} service.`
    // })
    //
    // Send confirmation email to requester
    // Example: await sendEmail({
    //   to: email,
    //   subject: 'Service Request Received',
    //   body: `Thank you for your request! We'll review it and get back to you within 24-48 hours.`
    // })

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

