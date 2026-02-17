'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface ServiceRequestFormProps {
  serviceType: string
  serviceName: string
}

export function ServiceRequestForm({ serviceType, serviceName }: ServiceRequestFormProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 600)
  }

  return (
    <Button
      className="w-full relative overflow-hidden group"
      size="lg"
      onClick={handleClick}
    >
      <span className={`transition-all duration-300 ${isClicked ? 'scale-110' : 'scale-100'}`}>
        Coming Soon
      </span>
      <Sparkles className={`ml-2 h-4 w-4 transition-all duration-300 ${
        isClicked ? 'rotate-180 scale-125' : 'rotate-0 scale-100'
      }`} />

      {/* Ripple effect on click */}
      {isClicked && (
        <span className="absolute inset-0 bg-white/30 animate-ping rounded-md" />
      )}
    </Button>
  )
}

