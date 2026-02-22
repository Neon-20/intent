import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"

const footerLinks = {
  product: [
    { href: "/jobs", label: "Browse Jobs" },
    { href: "/services", label: "Career Services" },
    { href: "/about", label: "About Us" },
    { href: "/community", label: "Community" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

const socialLinks = [
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "https://github.com", label: "GitHub", icon: Github },
]

export function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/icon.svg"
                  alt="Stepping Stones Logo"
                  width={40}
                  height={40}
                  className="transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-foreground group-hover:text-foreground/90 transition-colors">
                  Stepping
                </span>
                <span className="text-xl font-bold text-primary group-hover:text-primary/90 transition-colors">
                  Stones
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your partner in career growth and job search success.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Stepping Stones. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

