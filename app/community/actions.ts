'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'

type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert']

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    // Validate inputs
    if (!name || !email || !message) {
      return {
        success: false,
        error: 'All fields are required',
      }
    }

    if (name.length < 2) {
      return {
        success: false,
        error: 'Name must be at least 2 characters',
      }
    }

    if (!email.includes('@')) {
      return {
        success: false,
        error: 'Please enter a valid email address',
      }
    }

    if (message.length < 10) {
      return {
        success: false,
        error: 'Message must be at least 10 characters',
      }
    }

    const supabase = await createClient()

    // Insert contact form submission into database
    const contactData: ContactSubmissionInsert = {
      name,
      email,
      message,
    }

    const { error } = await (supabase.from('contact_submissions') as any).insert(contactData)

    if (error) {
      console.error('Error submitting contact form:', error)
      return {
        success: false,
        error: 'Failed to submit form. Please try again later.',
      }
    }

    // TODO: Email Notifications
    // Send email notification to admin about new contact form submission
    // Example: await sendEmail({
    //   to: 'admin@steppingstones.com',
    //   subject: `New Contact Form Submission from ${name}`,
    //   body: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    // })
    //
    // Send confirmation email to user
    // Example: await sendEmail({
    //   to: email,
    //   subject: 'We received your message',
    //   body: `Thank you for contacting us! We'll get back to you as soon as possible.`
    // })

    return {
      success: true,
      message: 'Thank you for reaching out! We will get back to you soon.',
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    }
  }
}

