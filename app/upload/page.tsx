"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUploader } from "../components/file-uploader"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Shield, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { uploadToS3 } from "@/lib/s3"
import { Progress } from "@/components/ui/progress"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const router = useRouter()

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      setIsUploading(true)
      setCurrentStep("Uploading to storage...")
      setUploadProgress(10)

      // Process the first file (we'll handle one at a time for simplicity)
      const file = files[0]

      // Upload to S3
      setUploadProgress(30)
      const { file_key, file_name } = await uploadToS3(file)

      // Create chat
      setCurrentStep("Processing document...")
      setUploadProgress(60)

      const createChatResponse = await fetch("/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_key,
          file_name,
        }),
      })

      if (!createChatResponse.ok) {
        throw new Error("Failed to create chat")
      }

      setUploadProgress(90)
      setCurrentStep("Preparing chat interface...")

      const { chat_id } = await createChatResponse.json()

      // Success notification
      toast("Upload successful!",{
        description: "Your PDF has been uploaded and is ready for chat.",
      })

      setUploadProgress(100)

      // Redirect to the chat page with the correct chatId
      setTimeout(() => {
        router.push(`/chat/${chat_id}`)
      }, 1000) // Small delay to show 100% progress
    } catch (error) {
      console.error("Upload error:", error)
      toast("Upload failed",{
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
      setUploadProgress(0)
      setCurrentStep(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Upload PDF</CardTitle>
              </div>
              <CardDescription>
                Upload your PDF documents to chat with them using AI. Your documents will be processed and ready for
                chat in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUploading ? (
                <div className="space-y-6 py-8">
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">{currentStep}</p>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="text-sm font-medium">Processing your document</p>
                    <p className="text-xs text-muted-foreground">This may take a minute for larger files</p>
                  </div>
                </div>
              ) : (
                <FileUploader onUpload={handleUpload} />
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Document Privacy</p>
                    <p>
                      Your documents are encrypted and securely stored. Only you can access your uploaded documents.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">AI-Powered Analysis</p>
                    <p>Our AI will analyze your document to provide accurate answers to your questions.</p>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

