"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background/95 via-background/95 to-primary/5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Stepping Stones Logo"
              width={40}
              height={40}
              className="transition-transform group-hover:scale-110"
              priority
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

        {/* Desktop Navigation - Aligned Right */}
        <nav className="hidden md:flex items-center space-x-8 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - Commented out for v1 */}
        {/* <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div> */}

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground/60 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile CTA - Commented out for v1 */}
              {/* <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div> */}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

