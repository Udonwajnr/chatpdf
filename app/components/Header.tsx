"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Menu, Search, X } from 'lucide-react'
import { cn } from "@/lib/utils"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for better header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md border-b"
          : "bg-background border-b"
      )}
    >
      <div className="container mx-auto">
        {/* Main header row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            onClick={closeMenu}
          >
            <FileText className="h-6 w-6 text-primary" />
            <span>ChatPDF</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide Down */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background border-t",
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto py-4 space-y-4">
          <nav className="flex flex-col space-y-3">
            <Link 
              href="#features" 
              className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-color"
              onClick={closeMenu}
            >
              How It Works
            </Link>
            <Link 
              href="#pricing" 
              className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={closeMenu}
            >
              Pricing
            </Link>
            <Link 
              href="#testimonials" 
              className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={closeMenu}
            >
              Testimonials
            </Link>
            <Link 
              href="#faq" 
              className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
              onClick={closeMenu}
            >
              FAQ
            </Link>
          </nav>
          
          <div className="pt-4 border-t flex flex-col gap-3">
            <Link href="/sign-in" onClick={closeMenu}>
              <Button variant="outline" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" onClick={closeMenu}>
              <Button className="w-full justify-center">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
