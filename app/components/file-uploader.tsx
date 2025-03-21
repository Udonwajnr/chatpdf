"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, type File, X, AlertCircle, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for PDF files only
    const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf")

    // Check if any files were rejected because they weren't PDFs
    if (acceptedFiles.length > pdfFiles.length) {
      setError("Only PDF files are accepted")
      setTimeout(() => setError(null), 5000)
    }

    // Check file size
    const oversizedFiles = pdfFiles.filter((file) => file.size > 10485760) // 10MB
    if (oversizedFiles.length > 0) {
      setError("Some files exceed the 10MB limit and were rejected")
      setTimeout(() => setError(null), 5000)

      // Filter out oversized files
      const validFiles = pdfFiles.filter((file) => file.size <= 10485760)
      setFiles((prev) => [...prev, ...validFiles])
    } else {
      setFiles((prev) => [...prev, ...pdfFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10485760, // 10MB
    multiple: false, // Only allow one file at a time
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setError(null)
    await onUpload(files)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && !isDragReject && "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">
              {isDragActive
                ? isDragReject
                  ? "This file type is not supported"
                  : "Drop your PDF here"
                : "Drag & drop your PDF here"}
            </p>
            <p className="text-xs text-muted-foreground">or click to browse files</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">PDF files only</div>
            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Up to 10MB</div>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border p-3 bg-muted/20">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleUpload} className="w-full" disabled={files.length === 0}>
            Upload and Process PDF
          </Button>
        </div>
      )}
    </div>
  )
}

