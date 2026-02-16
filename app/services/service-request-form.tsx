'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { submitServiceRequest } from './actions'
import { Loader2 } from 'lucide-react'

const serviceRequestSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().optional(),
  resume: z.instanceof(File).optional(),
})

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>

interface ServiceRequestFormProps {
  serviceType: string
  serviceName: string
}

export function ServiceRequestForm({ serviceType, serviceName }: ServiceRequestFormProps) {
  const [isOpen, setIsOpen] = useState(false)
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
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
  })

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formData = new FormData()
      formData.append('service_type', serviceType)
      formData.append('full_name', data.full_name)
      formData.append('email', data.email)
      if (data.phone) formData.append('phone', data.phone)
      if (data.message) formData.append('message', data.message)
      if (data.resume) formData.append('resume', data.resume)

      const result = await submitServiceRequest(formData)

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Request submitted successfully! We\'ll contact you within 24 hours.',
        })
        reset()
        // Close the sheet after 2 seconds
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus(null)
        }, 2000)
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit request. Please try again.',
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full" size="lg">
          Request {serviceName}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Request {serviceName}</SheetTitle>
          <SheetDescription>
            Fill out the form below and we'll get back to you within 24 hours.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
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
              placeholder="+91 98765 43210"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="resume">
              Current Resume (PDF, DOC, DOCX)
              {serviceType !== 'career-guidance' && ' *'}
            </Label>
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
            <p className="text-xs text-muted-foreground mt-1">
              Upload your current resume for review
            </p>
          </div>

          <div>
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your career goals, target roles, or any specific concerns..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

