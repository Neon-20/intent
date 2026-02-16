'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  jobId: string
  jobTitle: string
}

export function ShareButton({ jobId, jobTitle }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/${jobId}`
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: jobTitle,
          text: `Check out this job: ${jobTitle}`,
          url,
        })
        return
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      title="Share this job"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  )
}

