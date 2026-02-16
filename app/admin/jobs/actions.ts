'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/database.types'

type JobInsert = Database['public']['Tables']['jobs']['Insert']
type JobUpdate = Database['public']['Tables']['jobs']['Update']

export async function createJob(formData: FormData) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return { success: false, error: 'Unauthorized' }
    }

    // Handle logo upload if provided
    let logoUrl: string | null = null
    const logoFile = formData.get('logo') as File | null
    
    if (logoFile && logoFile.size > 0) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, logoFile, {
          contentType: logoFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Logo upload error:', uploadError)
        return { success: false, error: 'Failed to upload logo' }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath)

      logoUrl = publicUrl
    }

    // Parse skills from JSON string
    const skillsJson = formData.get('skills') as string
    const skills = skillsJson ? JSON.parse(skillsJson) : []

    // Create job
    const jobData: JobInsert = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string || null,
      category: formData.get('category') as string,
      job_type: formData.get('job_type') as string,
      experience_level: formData.get('experience_level') as string,
      location: formData.get('location') as string,
      salary_range: formData.get('salary_range') as string || null,
      skills: skills,
      apply_url: formData.get('apply_url') as string || null,
      logo_url: logoUrl,
      is_active: formData.get('is_active') === 'true',
    }

    const { error: insertError } = await supabase
      .from('jobs')
      .insert(jobData as any)

    if (insertError) {
      console.error('Insert error:', insertError)
      return { success: false, error: 'Failed to create job' }
    }

    revalidatePath('/admin/jobs')
    revalidatePath('/jobs')
    return { success: true }
  } catch (error) {
    console.error('Create job error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateJob(jobId: string, formData: FormData) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return { success: false, error: 'Unauthorized' }
    }

    // Handle logo upload if provided
    let logoUrl: string | null = formData.get('existing_logo_url') as string || null
    const logoFile = formData.get('logo') as File | null
    
    if (logoFile && logoFile.size > 0) {
      const fileExt = logoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, logoFile, {
          contentType: logoFile.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Logo upload error:', uploadError)
        return { success: false, error: 'Failed to upload logo' }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath)

      logoUrl = publicUrl
    }

    // Parse skills from JSON string
    const skillsJson = formData.get('skills') as string
    const skills = skillsJson ? JSON.parse(skillsJson) : []

    // Update job
    const jobData: JobUpdate = {
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string || null,
      category: formData.get('category') as string,
      job_type: formData.get('job_type') as string,
      experience_level: formData.get('experience_level') as string,
      location: formData.get('location') as string,
      salary_range: formData.get('salary_range') as string || null,
      skills: skills,
      apply_url: formData.get('apply_url') as string || null,
      logo_url: logoUrl,
      is_active: formData.get('is_active') === 'true',
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await (supabase
      .from('jobs') as any)
      .update(jobData as JobUpdate)
      .eq('id', jobId)

    if (updateError) {
      console.error('Update error:', updateError)
      return { success: false, error: 'Failed to update job' }
    }

    revalidatePath('/admin/jobs')
    revalidatePath(`/admin/jobs/${jobId}/edit`)
    revalidatePath('/jobs')
    return { success: true }
  } catch (error) {
    console.error('Update job error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteJob(jobId: string) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return { success: false, error: 'Failed to delete job' }
    }

    revalidatePath('/admin/jobs')
    revalidatePath('/jobs')
    return { success: true }
  } catch (error) {
    console.error('Delete job error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function toggleJobStatus(jobId: string, isActive: boolean) {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error: updateError } = await (supabase as any)
      .from('jobs')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', jobId)

    if (updateError) {
      console.error('Toggle status error:', updateError)
      return { success: false, error: 'Failed to update job status' }
    }

    revalidatePath('/admin/jobs')
    revalidatePath('/jobs')
    return { success: true }
  } catch (error) {
    console.error('Toggle job status error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

