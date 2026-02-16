'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to ensure animation triggers on mount
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative bg-gradient-to-b from-primary/5 via-primary/3 to-background overflow-hidden">
      {/* Faint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 101, 74, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 101, 74, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle floating radial gradients */}
      <div
        className="absolute top-10 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(212, 101, 74, 0.15) 0%, rgba(212, 101, 74, 0.08) 40%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite',
          opacity: 0.6
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(212, 101, 74, 0.12) 0%, rgba(212, 101, 74, 0.06) 40%, transparent 70%)',
          animation: 'float 15s ease-in-out infinite reverse',
          opacity: 0.5
        }}
      />

      {/* Soft animated stone shapes */}
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-primary/5 rounded-[40%] blur-2xl opacity-40" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '0s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary/4 rounded-[45%] blur-2xl opacity-30" style={{ animation: 'float 14s ease-in-out infinite', animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary/6 rounded-[35%] blur-xl opacity-25" style={{ animation: 'float 11s ease-in-out infinite', animationDelay: '1s' }} />

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          <div
            className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0ms' }}
          >
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              Your Career Partner
            </Badge>
          </div>
          <div
            className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Find the right job.{" "}
              <span className="text-primary">Fix your resume.</span>{" "}
              Get hired.
            </h1>
          </div>
          <div
            className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Discover curated job opportunities, get expert resume reviews, and receive personalized career guidance to accelerate your professional journey.
            </p>
          </div>
          <div
            className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="text-base">
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

