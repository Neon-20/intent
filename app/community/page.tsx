import { Metadata } from 'next'
import { PublicLayout } from '@/components/public-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Instagram, Linkedin, Twitter } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Join the Stepping Stones community. Connect with fellow job seekers, get career tips, and stay updated on the latest opportunities. Follow us on WhatsApp, Instagram, LinkedIn, and Twitter.',
  keywords: ['community', 'job seekers community', 'career network', 'whatsapp community', 'social media', 'career support'],
  openGraph: {
    title: 'Community | Stepping Stones',
    description: 'Join the Stepping Stones community. Connect with us on social media and reach out for support.',
    type: 'website',
    url: '/community',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community | Stepping Stones',
    description: 'Join the Stepping Stones community. Connect with us on social media and reach out for support.',
  },
}

const socialLinks = [
  {
    name: 'WhatsApp Community',
    description: 'Join our WhatsApp community for job alerts, career tips, and networking opportunities.',
    icon: MessageCircle,
    href: 'https://whatsapp.com/channel/0029VaeqWgx7oQhlSsTo1F0F',
    color: 'bg-primary',
    hoverColor: 'hover:bg-primary/90',
    primary: true,
  },
  {
    name: 'Instagram',
    description: 'Follow us for career inspiration, success stories, and daily motivation.',
    icon: Instagram,
    href: '#',
    color: 'bg-primary',
    hoverColor: 'hover:bg-primary/90',
  },
  {
    name: 'LinkedIn',
    description: 'Connect with us professionally and stay updated on industry insights.',
    icon: Linkedin,
    href: '#',
    color: 'bg-primary',
    hoverColor: 'hover:bg-primary/90',
  },
  {
    name: 'Twitter/X',
    description: 'Get real-time updates on new job postings and career opportunities.',
    icon: Twitter,
    href: '#',
    color: 'bg-primary',
    hoverColor: 'hover:bg-primary/90',
  },
]

export default function CommunityPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Join Our <span className="text-primary">Community</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with fellow job seekers, get career tips, and stay updated on the latest opportunities
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA Section */}
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Join Our WhatsApp Community</CardTitle>
              <CardDescription className="text-lg mt-2">
                Get instant job alerts, career tips, and connect with thousands of job seekers
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6"
              >
                <a
                  href="https://whatsapp.com/channel/0029VaeqWgx7oQhlSsTo1F0F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join WhatsApp Community
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Social Media Links */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Connect With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <ScrollReveal key={social.name} delay={index * 100} className="h-full">
                  <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                    <CardHeader className="flex-grow">
                      <div className={`p-3 rounded-full ${social.color} w-fit mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{social.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {social.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full"
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Follow Us
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
                <p className="text-muted-foreground">
                  Have questions or need assistance? Send us a message and we'll get back to you as soon as possible.
                </p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

