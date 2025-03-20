import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  Lightbulb,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react"
import { TestimonialCard } from "@/app/components/TestimonialCard"
import { PricingCard } from "@/app/components/PricingCard"
import Header from "@/app/components/Header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      {/* Header */}
      <Header />

      <main className="flex-1 ">
        {/* Hero Section */}
        <section className="container space-y-6 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Chat with your PDF documents using AI
            </h1>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              Upload your PDF documents and get instant answers. Our AI-powered chat interface makes it easy to extract
              insights from your documents.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Try for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-5xl rounded-lg border bg-card p-4 shadow-lg">
            <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="flex h-full items-center justify-center">
                <div className="relative flex w-full max-w-3xl flex-col items-center rounded-lg border bg-background p-8 shadow-lg">
                  <div className="absolute -top-3 left-4 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    AI Chat
                  </div>
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        What are the key findings in this research paper?
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-secondary/10 p-3 text-sm">
                        The key findings of this research paper include:
                        <ol className="ml-4 mt-2 list-decimal space-y-1">
                          <li>A 45% increase in efficiency using the new methodology</li>
                          <li>Significant reduction in error rates compared to traditional approaches</li>
                          <li>Cost savings of approximately 30% when implemented at scale</li>
                        </ol>
                        These results suggest that the proposed solution is viable for industry adoption.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="border-y bg-muted/40 py-10">
          <div className="container">
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Trusted by innovative companies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {["Acme Inc", "GlobalTech", "Innovate AI", "ResearchLab", "DataSphere"].map((company) => (
                  <div key={company} className="text-lg font-semibold text-muted-foreground/70">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <Badge className="w-fit" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              Everything you need to extract insights
            </h2>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              Our platform provides powerful tools to help you understand and interact with your PDF documents
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Chat",
                description:
                  "Ask questions about your documents and get accurate answers instantly with our advanced AI model",
                icon: <MessageSquare className="h-10 w-10 text-primary" />,
              },
              {
                title: "Easy Upload",
                description: "Drag and drop your PDFs or select them from your device with our intuitive interface",
                icon: <Upload className="h-10 w-10 text-primary" />,
              },
              {
                title: "Secure Storage",
                description: "Your documents are encrypted and stored securely with enterprise-grade security",
                icon: <Shield className="h-10 w-10 text-primary" />,
              },
              {
                title: "Smart Search",
                description:
                  "Find information across all your documents with our powerful semantic search capabilities",
                icon: <Search className="h-10 w-10 text-primary" />,
              },
              {
                title: "Fast Processing",
                description: "Our system processes even large documents in seconds, saving you valuable time",
                icon: <Zap className="h-10 w-10 text-primary" />,
              },
              {
                title: "Multi-language Support",
                description: "Analyze documents in multiple languages with our global language processing",
                icon: <Globe className="h-10 w-10 text-primary" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col border-none bg-background shadow-md transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 rounded-full bg-primary/10 p-3 w-fit">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-muted/30 py-16 md:py-24">
          <div className="container space-y-12">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <Badge className="w-fit" variant="outline">
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
                Simple process, powerful results
              </h2>
              <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
                Get started in minutes and start extracting insights from your documents
              </p>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Upload your PDF",
                    description: "Drag and drop your PDF files or select them from your device",
                    icon: <Upload className="h-8 w-8" />,
                  },
                  {
                    step: "02",
                    title: "Ask questions",
                    description: "Type your questions about the document in natural language",
                    icon: <MessageSquare className="h-8 w-8" />,
                  },
                  {
                    step: "03",
                    title: "Get insights",
                    description: "Receive accurate answers and extract valuable insights instantly",
                    icon: <Lightbulb className="h-8 w-8" />,
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center rounded-lg bg-background p-6 text-center shadow-sm"
                  >
                    <div className="absolute -top-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                      {step.step}
                    </div>
                    <div className="mb-4 mt-4 rounded-full bg-primary/10 p-3">{step.icon}</div>
                    <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    {index < 2 && (
                      <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-primary md:block">
                        <ChevronRight className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <Badge className="w-fit" variant="outline">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              Loved by researchers and professionals
            </h2>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              See what our users have to say about their experience with ChatPDF
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="ChatPDF has revolutionized how I review research papers. I can get answers to specific questions without reading the entire document."
              author="Dr. Sarah Johnson"
              role="Research Scientist"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={5}
            />
            <TestimonialCard
              quote="As a lawyer, I deal with hundreds of pages of documents daily. ChatPDF helps me extract key information in seconds instead of hours."
              author="Michael Chen"
              role="Corporate Attorney"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={5}
            />
            <TestimonialCard
              quote="The accuracy of the answers is impressive. It's like having a research assistant that works 24/7 and never gets tired."
              author="Emily Rodriguez"
              role="PhD Candidate"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={4}
            />
            <TestimonialCard
              quote="I use ChatPDF to analyze financial reports quickly. It's become an essential tool for my investment research process."
              author="Robert Williams"
              role="Financial Analyst"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={5}
            />
            <TestimonialCard
              quote="The interface is intuitive and the responses are surprisingly nuanced. It understands context better than any other tool I've used."
              author="Priya Patel"
              role="Content Strategist"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={5}
            />
            <TestimonialCard
              quote="ChatPDF has saved our team countless hours of document review. The ROI was evident within the first week of use."
              author="James Thompson"
              role="Project Manager"
              avatarUrl="/placeholder.svg?height=80&width=80"
              rating={4}
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-muted/30 py-16 md:py-24">
          <div className="container space-y-12">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
              <Badge className="w-fit" variant="outline">
                Pricing
              </Badge>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
                Simple, transparent pricing
              </h2>
              <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
                Choose the plan that's right for you
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <PricingCard
                title="Free"
                price="$0"
                description="Perfect for trying out ChatPDF"
                features={[
                  "5 PDF uploads per month",
                  "Up to 20 pages per PDF",
                  "Basic AI chat functionality",
                  "7-day data retention",
                  "Community support",
                ]}
                buttonText="Get Started"
                buttonVariant="outline"
                popular={false}
              />
              <PricingCard
                title="Pro"
                price="$19"
                period="per month"
                description="For individuals with regular needs"
                features={[
                  "50 PDF uploads per month",
                  "Up to 100 pages per PDF",
                  "Advanced AI chat functionality",
                  "30-day data retention",
                  "Priority email support",
                  "PDF annotation tools",
                  "Export chat history",
                ]}
                buttonText="Subscribe Now"
                buttonVariant="default"
                popular={true}
              />
              <PricingCard
                title="Enterprise"
                price="$49"
                period="per month"
                description="For teams and heavy users"
                features={[
                  "Unlimited PDF uploads",
                  "Unlimited pages per PDF",
                  "Premium AI chat functionality",
                  "Unlimited data retention",
                  "24/7 priority support",
                  "Advanced security features",
                  "Team collaboration tools",
                  "API access",
                  "Custom integrations",
                ]}
                buttonText="Contact Sales"
                buttonVariant="outline"
                popular={false}
              />
            </div>
            <div className="mx-auto max-w-3xl rounded-lg border bg-card p-6 text-center shadow-sm">
              <h3 className="mb-2 text-xl font-bold">Need a custom plan?</h3>
              <p className="mb-4 text-muted-foreground">
                Contact our sales team for custom pricing options for larger teams and specific requirements.
              </p>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <Badge className="w-fit" variant="outline">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              Frequently asked questions
            </h2>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              Everything you need to know about ChatPDF
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How accurate are the AI responses?",
                  answer:
                    "ChatPDF uses advanced AI models to provide highly accurate responses based on the content of your documents. The system is designed to understand context and provide relevant information. However, as with any AI system, it's always good practice to verify critical information.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Yes, we take data security very seriously. All documents are encrypted both in transit and at rest. We use enterprise-grade security measures to protect your data, and we never share your documents with third parties. You can delete your documents at any time.",
                },
                {
                  question: "What file types are supported?",
                  answer:
                    "Currently, ChatPDF supports PDF files. We're working on adding support for additional document formats such as DOCX, TXT, and more in the near future.",
                },
                {
                  question: "Is there a limit to the file size?",
                  answer:
                    "Free accounts can upload PDFs up to 10MB and 20 pages. Pro accounts can upload PDFs up to 50MB and 100 pages. Enterprise accounts have higher limits and can contact us for custom requirements.",
                },
                {
                  question: "Can I use ChatPDF offline?",
                  answer:
                    "ChatPDF requires an internet connection to function as it uses cloud-based AI models for processing documents and generating responses.",
                },
                {
                  question: "How do I cancel my subscription?",
                  answer:
                    "You can cancel your subscription at any time from your account settings. Once canceled, you'll continue to have access to your plan until the end of your billing period.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container py-16 md:py-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6 text-center">
              <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
                Ready to transform how you work with documents?
              </h2>
              <p className="max-w-[46rem] text-lg text-primary-foreground/80 sm:text-xl">
                Join thousands of professionals who are saving time and gaining insights with ChatPDF.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Get Started for Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-primary-foreground/70">
                No credit card required for free plan. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ChatPDF</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered document analysis and chat interface for PDF documents.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Data Processing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ChatPDF. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

