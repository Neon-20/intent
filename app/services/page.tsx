import { Metadata } from 'next'
import { PublicLayout } from '@/components/public-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, FileText, Sparkles, Users } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { ServiceRequestForm } from './service-request-form'

export const metadata: Metadata = {
  title: 'Career Services',
  description: 'Professional resume review, career guidance, and consultancy services to help you land your dream job. Choose from basic review, detailed review, or full resume rewrite services.',
  keywords: ['resume review', 'career guidance', 'career consultancy', 'resume writing', 'professional resume', 'career coaching', 'interview preparation'],
  openGraph: {
    title: 'Career Services | Stepping Stones',
    description: 'Professional resume review, career guidance, and consultancy services to help you land your dream job.',
    type: 'website',
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Services | Stepping Stones',
    description: 'Professional resume review, career guidance, and consultancy services to help you land your dream job.',
  },
}

const resumeServices = [
  {
    id: 'basic-review',
    name: 'Basic Review',
    price: 'Free',
    description: 'Quick feedback on your resume structure and formatting',
    features: [
      'Resume structure analysis',
      'Formatting suggestions',
      'Basic grammar check',
      'Delivered within 48 hours',
    ],
    serviceType: 'basic-review',
    popular: false,
  },
  {
    id: 'detailed-review',
    name: 'Detailed Review',
    price: '₹499',
    description: 'Comprehensive review with actionable feedback',
    features: [
      'Everything in Basic Review',
      'Content optimization suggestions',
      'ATS compatibility check',
      'Keyword optimization',
      'Industry-specific feedback',
      'Delivered within 24 hours',
    ],
    serviceType: 'detailed-review',
    popular: true,
  },
  {
    id: 'full-rewrite',
    name: 'Full Rewrite',
    price: '₹1,999',
    description: 'Complete professional resume transformation',
    features: [
      'Everything in Detailed Review',
      'Complete resume rewrite',
      'Professional formatting',
      'Cover letter template',
      'LinkedIn profile optimization tips',
      'Two rounds of revisions',
      'Delivered within 3-5 days',
    ],
    serviceType: 'full-rewrite',
    popular: false,
  },
]

export default function ServicesPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Career Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional resume reviews and career guidance to help you stand out and land your dream job
            </p>
          </div>
        </div>

        {/* Resume Review Services */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Resume Review Services</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the service that best fits your needs. All reviews are conducted by experienced career professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resumeServices.map((service, index) => (
              <ScrollReveal key={service.id} delay={index * 100} className="h-full">
              <Card
                className={`relative h-full flex flex-col ${
                  service.popular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {service.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="flex-grow">
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {service.price}
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                  <ul className="space-y-3 pt-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <ServiceRequestForm serviceType={service.serviceType} serviceName={service.name} />
                </CardContent>
              </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Career Guidance Section */}
        <div className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold">Career Guidance</h2>
                </div>
                <p className="text-muted-foreground">
                  One-on-one sessions with experienced career consultants
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Personalized Career Consultation</CardTitle>
                  <CardDescription>
                    Get expert guidance tailored to your career goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        What We Cover
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          Career path planning and strategy
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          Interview preparation and mock interviews
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          Salary negotiation strategies
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          LinkedIn profile optimization
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          Job search strategies
                        </li>
                      </ul>
                    </div>
                  </div>
                  <ServiceRequestForm serviceType="career-guidance" serviceName="Career Guidance" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

