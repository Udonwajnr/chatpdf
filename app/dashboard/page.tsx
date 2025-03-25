"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload } from "lucide-react"
import Header from "../components/Header"
import { PDFCard } from "../components/pdf-card"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PDF {
  id: string
  name: string
  pages: number
  date: string
  url: string
}

export default function DashboardPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  console.log(pdfs)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/documents")
        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }
        const data = await response.json()
        setPdfs(data.documents)
      } catch (error) {
        console.error("Error fetching documents:", error)
        toast("Error",{
          description: "Failed to load your documents. Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [toast])

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Link href="/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" /> Upload PDF
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="documents">My Documents</TabsTrigger>
              <TabsTrigger value="chats">Recent Chats</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="space-y-6 mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-muted-foreground">Loading your documents...</p>
                </div>
              ) : pdfs.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pdfs.map((pdf) => (
                    <PDFCard key={pdf.id} pdf={pdf} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload your first PDF</CardTitle>
                    <CardDescription>Get started by uploading a PDF document to chat with</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="rounded-full bg-primary/10 p-6 mb-4">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-center text-muted-foreground mb-6 max-w-md">
                      Upload your research papers, reports, or any PDF document and start asking questions about its
                      content.
                    </p>
                    <Link href="/upload">
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" /> Upload PDF
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="chats" className="space-y-6 mt-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-muted-foreground">Loading your recent chats...</p>
                </div>
              ) : pdfs.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pdfs.map((pdf) => (
                    <Card 
                    key={pdf.id} 
                     className={cn(
                            "overflow-hidden transition-all duration-300 hover:shadow-lg group relative",
                            "bg-gradient-to-br from-background to-background/80 hover:from-primary/5 hover:to-background",
                          )}>
                             {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/30 opacity-70 group-hover:opacity-100 transition-opacity" />

                      <CardHeader className="p-4">
                        <CardTitle className="text-lg truncate">{pdf.name}</CardTitle>
                        <CardDescription>Last chat: {pdf.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-sm text-muted-foreground">
                          Continue your conversation about this document
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Link href={`/chat/${pdf.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto bg-primary/90 text-white">
                            Continue Chat
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-center text-muted-foreground mb-6">
                      You haven't started any chats yet. Upload a document to get started.
                    </p>
                    <Link href="/upload">
                      <Button className="gap-2">
                        <Upload className="h-4 w-4" /> Upload PDF
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

