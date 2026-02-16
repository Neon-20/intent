import { Metadata } from "next"
import { PublicLayout } from "@/components/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, FileText, Users, ArrowRight, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { JobCard } from "@/components/job-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { HeroSection } from "@/components/hero-section"
import type { Database } from "@/lib/database.types"

type Job = Database['public']['Tables']['jobs']['Row']

export const metadata: Metadata = {
  title: "Home",
  description: "Find your dream job and get expert career guidance with Stepping Stones. Browse curated job opportunities, get professional resume reviews, and receive personalized career consultancy.",
  openGraph: {
    title: "Stepping Stones - Job Portal & Career Consultancy",
    description: "Find your dream job and get expert career guidance. Browse jobs, get resume reviews, and receive career consultancy.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stepping Stones - Job Portal & Career Consultancy",
    description: "Find your dream job and get expert career guidance. Browse jobs, get resume reviews, and receive career consultancy.",
  },
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch 6 most recent active jobs
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('posted_at', { ascending: false })
    .limit(6)
    .returns<Job[]>()

  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Services Cards Section */}
      <section className="relative py-16 md:py-24 bg-background overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-40" />

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Help You Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to land your dream job, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Jobs Card */}
            <ScrollReveal delay={0}>
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-background to-primary/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Browse Jobs</CardTitle>
                <CardDescription className="text-base">
                  Access curated job listings from top companies. Filter by role, location, and experience level to find your perfect match.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group">
                  <Link href="/jobs">
                    Explore Jobs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Resume Review Card */}
            <ScrollReveal delay={100}>
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/15 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/15 flex items-center justify-center mb-4 shadow-md">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Resume Review</CardTitle>
                <CardDescription className="text-base">
                  Get expert feedback on your resume. Our professionals help you stand out and land more interviews.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group">
                  <Link href="/services">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </ScrollReveal>

            {/* Career Guidance Card */}
            <ScrollReveal delay={200}>
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-gradient-to-br from-background to-primary/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-sm">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Career Guidance</CardTitle>
                <CardDescription className="text-base">
                  One-on-one consultations with career experts. Get personalized advice to navigate your career path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" asChild className="group">
                  <Link href="/services">
                    Book Session
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs && featuredJobs.length > 0 && (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary/30 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/20 rounded-full" />

          <div className="relative container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Opportunities</h2>
                <p className="text-lg text-muted-foreground">
                  Fresh job postings from companies looking for talent like you
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex hover:bg-primary hover:text-primary-foreground transition-colors">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job, index) => (
                <ScrollReveal key={job.id} delay={index * 100}>
                  <JobCard job={job} />
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Resume Review CTA Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
        {/* Decorative gradient shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center bg-background/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary/10 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Resume Reviewed
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stand out from the competition with a professionally reviewed resume. Our experts provide detailed feedback and actionable improvements to help you land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/services">
                  Request Review
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Community Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-40" />

        <div className="relative container mx-auto px-4">
          <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with fellow job seekers, get career tips, and stay updated on the latest opportunities. Join our WhatsApp community and follow us on social media.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <a
                  href="https://wa.me/your-whatsapp-number"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <MessageCircle className="mr-2 h-5 w-5 text-primary-foreground" />
                  Join WhatsApp Group
                </a>
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" asChild className="hover:text-primary">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Twitter"
                    className="text-primary"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild className="hover:text-primary">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on LinkedIn"
                    className="text-primary"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  )
}
