"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X, LogIn, UserPlus, MessageSquare, Upload, User, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton, SignedIn, SignedOut, SignInButton, useUser,useAuth } from "@clerk/nextjs"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useUser()
  const auth = useAuth()
  

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
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md border-b" : "bg-background border-b",
      )}
    >
      <div className="container mx-auto">
        {/* Main header row */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={closeMenu}>
            <FileText className="h-6 w-6 text-primary" />
            <span>ChatPDF</span>
          </Link>

          {/* Desktop Navigation */}
          <SignedOut>
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
          </SignedOut>

          <SignedIn>
            <nav className="hidden md:flex gap-8">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              {/* <Link href="/documents" className="text-sm font-medium hover:text-primary transition-colors">
                My Documents
              </Link>
              <Link href="/settings" className="text-sm font-medium hover:text-primary transition-colors">
                Settings
              </Link> */}
            </nav>
          </SignedIn>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
              <Link href="/sign-up">
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </SignedOut>

            <SignedIn>
              {/* <Link href="/dashboard">
                <Button size="sm" variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  dashboard
                </Button>
              </Link> */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
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
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto py-4 space-y-4">
          <SignedIn>
            <div className="flex items-center gap-3 p-3 mb-2 border-b pb-4">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
              <div>
                <p className="font-medium">{user?.fullName || user?.username || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <MessageSquare className="h-5 w-5 text-primary" />
                Dashboard
              </Link>
              <Link
                href="/documents"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <FileText className="h-5 w-5 text-primary" />
                My Documents
              </Link>
              <Link
                href="/upload"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Upload className="h-5 w-5 text-primary" />
                Upload PDF
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Settings className="h-5 w-5 text-primary" />
                Settings
              </Link>
            </nav>
          </SignedIn>

          <SignedOut>
            <nav className="flex flex-col space-y-1">
              <Link
                href="#features"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <MessageSquare className="h-5 w-5 text-primary" />
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <FileText className="h-5 w-5 text-primary" />
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Upload className="h-5 w-5 text-primary" />
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <User className="h-5 w-5 text-primary" />
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                onClick={closeMenu}
              >
                <Settings className="h-5 w-5 text-primary" />
                FAQ
              </Link>
            </nav>

            <div className="pt-4 border-t flex flex-col gap-3 mt-4">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-center gap-2" onClick={closeMenu}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>

              <Link href="/sign-up" onClick={closeMenu}>
                <Button className="w-full justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header

