"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, LogOut, MessageSquare, Plus, Settings, User } from "lucide-react"
import { FileUploader } from "@/app/components/file-uploader"
import { PDFCard } from "@/app/components/pdf-card"

export default function DashboardPage() {
  const [pdfs, setPdfs] = useState([
    { id: 1, name: "Research Paper.pdf", pages: 12, date: "2023-10-15" },
    { id: 2, name: "Financial Report.pdf", pages: 24, date: "2023-10-10" },
    { id: 3, name: "Product Documentation.pdf", pages: 36, date: "2023-09-28" },
  ])

  const handleUpload = (files: File[]) => {
    // In a real app, you would upload these files to your backend
    const newPdfs = files.map((file, index) => ({
      id: pdfs.length + index + 1,
      name: file.name,
      pages: Math.floor(Math.random() * 50) + 1, // Mock page count
      date: new Date().toISOString().split("T")[0],
    }))

    setPdfs([...newPdfs, ...pdfs])
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ChatPDF</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="documents">My Documents</TabsTrigger>
              <TabsTrigger value="chats">Recent Chats</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF</CardTitle>
                  <CardDescription>Upload your PDF documents to chat with them</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader onUpload={handleUpload} />
                </CardContent>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pdfs.map((pdf) => (
                  <PDFCard key={pdf.id} pdf={pdf} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="chats" className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pdfs.map((pdf) => (
                  <Card key={pdf.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg truncate">{pdf.name}</CardTitle>
                      <CardDescription>Last chat: {pdf.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm text-muted-foreground">3 conversations</div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" /> Continue
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Settings className="h-4 w-4" /> Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

