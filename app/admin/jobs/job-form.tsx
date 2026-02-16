'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, X } from 'lucide-react'
import { createJob, updateJob } from './actions'
import { MarkdownEditor } from './markdown-editor'
import { SkillsInput } from './skills-input'
import { JobPreview } from './job-preview'

type Job = Database['public']['Tables']['jobs']['Row']

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  job_type: z.string().min(1, 'Job type is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
  salary_range: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  apply_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean(),
})

type JobFormData = z.infer<typeof jobSchema>

interface JobFormProps {
  job?: Job
  mode: 'create' | 'edit'
}

const categories = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Customer Success',
  'Operations',
  'Finance',
  'HR',
  'Other',
]

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
const experienceLevels = ['Entry', 'Mid', 'Senior', 'Lead']

export function JobForm({ job, mode }: JobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(job?.logo_url || null)
  const [skills, setSkills] = useState<string[]>(job?.skills || [])
  const [showPreview, setShowPreview] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      category: job?.category || '',
      job_type: job?.job_type || '',
      experience_level: job?.experience_level || '',
      salary_range: job?.salary_range || '',
      description: job?.description || '',
      requirements: job?.requirements || '',
      apply_url: job?.apply_url || '',
      is_active: job?.is_active ?? true,
    },
  })

  const watchedFields = watch()

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      // Add skills as JSON
      formData.append('skills', JSON.stringify(skills))

      // Add logo if present
      if (logoFile) {
        formData.append('logo', logoFile)
      } else if (job?.logo_url) {
        formData.append('existing_logo_url', job.logo_url)
      }

      const result = mode === 'create' 
        ? await createJob(formData)
        : await updateJob(job!.id, formData)

      if (result.success) {
        router.push('/admin/jobs')
        router.refresh()
      } else {
        setSubmitError(result.error || 'Failed to save job')
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {submitError && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant={showPreview ? 'outline' : 'default'}
            onClick={() => setShowPreview(false)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant={showPreview ? 'default' : 'outline'}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </Button>
        </div>
      </div>

      {showPreview ? (
        <JobPreview
          title={watchedFields.title}
          company={watchedFields.company}
          location={watchedFields.location}
          jobType={watchedFields.job_type}
          experienceLevel={watchedFields.experience_level}
          salaryRange={watchedFields.salary_range}
          description={watchedFields.description}
          requirements={watchedFields.requirements}
          skills={skills}
          logoUrl={logoPreview}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Senior Software Engineer"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="e.g., Acme Inc."
                disabled={isSubmitting}
              />
              {errors.company && (
                <p className="text-sm text-destructive mt-1">{errors.company.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., Remote, San Francisco, CA"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Logo Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-16 w-16 object-contain rounded border"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 rounded-full bg-destructive text-white p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <Input
                  id="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleLogoChange}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Max 5MB. Supported formats: JPEG, PNG, WebP, SVG
              </p>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={watchedFields.category}
                onValueChange={(value) => setValue('category', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <Label htmlFor="job_type">Job Type *</Label>
              <Select
                value={watchedFields.job_type}
                onValueChange={(value) => setValue('job_type', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.job_type && (
                <p className="text-sm text-destructive mt-1">{errors.job_type.message}</p>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <Label htmlFor="experience_level">Experience Level *</Label>
              <Select
                value={watchedFields.experience_level}
                onValueChange={(value) => setValue('experience_level', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.experience_level && (
                <p className="text-sm text-destructive mt-1">{errors.experience_level.message}</p>
              )}
            </div>

            {/* Salary Range */}
            <div>
              <Label htmlFor="salary_range">Salary Range</Label>
              <Input
                id="salary_range"
                {...register('salary_range')}
                placeholder="e.g., $100k - $150k"
                disabled={isSubmitting}
              />
              {errors.salary_range && (
                <p className="text-sm text-destructive mt-1">{errors.salary_range.message}</p>
              )}
            </div>

            {/* Apply URL */}
            <div className="md:col-span-2">
              <Label htmlFor="apply_url">Application URL</Label>
              <Input
                id="apply_url"
                {...register('apply_url')}
                placeholder="https://example.com/apply"
                disabled={isSubmitting}
              />
              {errors.apply_url && (
                <p className="text-sm text-destructive mt-1">{errors.apply_url.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Optional external application link. Leave empty to use built-in application form.
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Job Description *</Label>
              <MarkdownEditor
                value={watchedFields.description}
                onChange={(value) => setValue('description', value)}
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <Label htmlFor="requirements">Requirements</Label>
              <MarkdownEditor
                value={watchedFields.requirements || ''}
                onChange={(value) => setValue('requirements', value)}
                placeholder="List the required skills, experience, and qualifications..."
                disabled={isSubmitting}
              />
              {errors.requirements && (
                <p className="text-sm text-destructive mt-1">{errors.requirements.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <Label>Skills & Technologies</Label>
              <SkillsInput
                skills={skills}
                onChange={setSkills}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add relevant skills and technologies for this position
              </p>
            </div>

            {/* Active Status */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={watchedFields.is_active}
                onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Publish this job (make it visible to candidates)
              </Label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Job' : 'Update Job'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

