import { Metadata } from 'next'
import { PublicLayout } from '@/components/public-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Users, Lightbulb, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Stepping Stones - your trusted partner in career growth and job search success. We help job seekers find meaningful career opportunities and achieve their professional goals.',
  keywords: ['about stepping stones', 'career platform', 'job portal', 'career consultancy', 'mission', 'values'],
  openGraph: {
    title: 'About Us | Stepping Stones',
    description: 'Learn about Stepping Stones - your partner in career growth and job search success.',
    type: 'website',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Stepping Stones',
    description: 'Learn about Stepping Stones - your partner in career growth and job search success.',
  },
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To empower job seekers with the tools, resources, and guidance they need to find meaningful career opportunities and achieve their professional goals.',
  },
  {
    icon: Users,
    title: 'Community First',
    description:
      'We believe in building a supportive community where job seekers can connect, learn, and grow together on their career journeys.',
  },
  {
    icon: Lightbulb,
    title: 'Expert Guidance',
    description:
      'Our team of career consultants brings years of industry experience to help you navigate the job market with confidence.',
  },
  {
    icon: Award,
    title: 'Quality Opportunities',
    description:
      'We carefully curate job listings from trusted companies to ensure you have access to legitimate, high-quality career opportunities.',
  },
]

const stats = [
  { value: '1000+', label: 'Job Listings' },
  { value: '500+', label: 'Happy Job Seekers' },
  { value: '100+', label: 'Partner Companies' },
  { value: '95%', label: 'Success Rate' },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                About <span className="text-primary">Stepping Stones</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Your trusted partner in navigating the job market and building a successful career
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Stepping Stones is a comprehensive job portal and career consultancy platform dedicated to 
                helping job seekers find their dream careers. We understand that job searching can be 
                overwhelming, which is why we've created a platform that simplifies the process and provides 
                expert guidance every step of the way.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're a recent graduate looking for your first opportunity, a professional seeking 
                career advancement, or someone exploring a career change, Stepping Stones is here to support 
                your journey with curated job listings, career services, and a vibrant community.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">{value.title}</h3>
                        <p className="text-sm text-muted-foreground">{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Job Portal</h3>
                  <p className="text-muted-foreground">
                    Browse thousands of curated job listings from trusted companies across various industries. 
                    Our advanced filters help you find opportunities that match your skills and career goals.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Career Services</h3>
                  <p className="text-muted-foreground">
                    Get expert help with resume reviews, career consultations, and interview preparation. 
                    Our experienced consultants are here to help you stand out in the job market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

