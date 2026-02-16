'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitApplication } from './actions'
import { Loader2 } from 'lucide-react'

const applicationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  cover_letter: z.string().optional(),
  resume: z.instanceof(File, { message: 'Resume is required' }),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface ApplicationFormProps {
  jobId: string
}

export function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    // TODO: Analytics - Track apply click
    // Increment apply_clicks counter in database
    // Example: await supabase.rpc('increment_apply_clicks', { job_id: jobId })

    try {
      const formData = new FormData()
      formData.append('job_id', jobId)
      formData.append('full_name', data.full_name)
      formData.append('email', data.email)
      if (data.phone) formData.append('phone', data.phone)
      if (data.cover_letter) formData.append('cover_letter', data.cover_letter)
      formData.append('resume', data.resume)

      const result = await submitApplication(formData)

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! We\'ll be in touch soon.',
        })
        reset()
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit application. Please try again.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          {...register('full_name')}
          placeholder="John Doe"
          disabled={isSubmitting}
        />
        {errors.full_name && (
          <p className="text-sm text-destructive mt-1">{errors.full_name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="john@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+1 (555) 123-4567"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="resume">Resume (PDF, DOC, DOCX) *</Label>
        <Input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          {...register('resume')}
          disabled={isSubmitting}
        />
        {errors.resume && (
          <p className="text-sm text-destructive mt-1">{errors.resume.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="cover_letter">Cover Letter</Label>
        <Textarea
          id="cover_letter"
          {...register('cover_letter')}
          placeholder="Tell us why you're a great fit for this role..."
          rows={4}
          disabled={isSubmitting}
        />
        {errors.cover_letter && (
          <p className="text-sm text-destructive mt-1">{errors.cover_letter.message}</p>
        )}
      </div>

      {submitStatus && (
        <div
          className={`p-3 rounded-md text-sm ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </Button>
    </form>
  )
}

