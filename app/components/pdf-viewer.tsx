"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Layers,
} from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [rotation, setRotation] = useState<number>(0)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset to page 1 when a new PDF is loaded
    setPageNumber(1)
    setLoading(true)
    setRotation(0)
  }, [pdfUrl])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const handlePreviousPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
  }

  const handleNextPage = () => {
    if (numPages) {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages))
    }
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && numPages && value >= 1 && value <= numPages) {
      setPageNumber(value)
    }
  }

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0))
  }

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5))
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = pdfUrl.split("/").pop() || "document.pdf"
      link.target = "_blank"
      link.click()
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const toggleFullscreen = () => {
    if (!fullscreen) {
      viewerRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const toggleThumbnails = () => {
    setShowThumbnails(!showThumbnails)
  }

  return (
    <div ref={viewerRef} className="flex flex-col h-full bg-background">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between border-b p-3 bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1 || loading}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center bg-muted/30 rounded-md px-2 py-1">
            <Input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={handlePageInputChange}
              className="w-12 h-7 text-center border-0 bg-transparent p-0"
              disabled={loading}
            />
            <span className="mx-1 text-sm text-muted-foreground">/ {numPages || "?"}</span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={!numPages || pageNumber >= numPages || loading}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleThumbnails}
                  className={cn("rounded-full", showThumbnails && "bg-muted")}
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showThumbnails ? "Hide thumbnails" : "Show thumbnails"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleSearch} disabled={loading} className="rounded-full">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5 || loading}
                  className="rounded-full"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="bg-muted/30 rounded-md px-2 py-1 text-xs font-medium">{Math.round(scale * 100)}%</div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={scale >= 2.0 || loading}
                  className="rounded-full"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRotate} disabled={loading} className="rounded-full">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="rounded-full">
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{fullscreen ? "Exit fullscreen" : "Fullscreen"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  disabled={loading}
                  className="rounded-full"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="p-3 border-b bg-card/50">
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Search in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
            <Button size="sm" variant="secondary" disabled={!searchQuery.trim()}>
              Find
            </Button>
            <Button size="sm" variant="ghost" onClick={toggleSearch} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Page thumbnails */}
        {showThumbnails && numPages && numPages > 1 && (
          <div className="w-20 border-r overflow-y-auto overflow-x-hidden bg-muted/10">
            <div className="flex flex-col p-2 gap-2">
              {Array.from(new Array(numPages), (_, index) => (
                <button
                  key={index}
                  className={cn(
                    "flex-shrink-0 w-16 h-20 border rounded transition-colors",
                    pageNumber === index + 1
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-muted hover:border-muted-foreground/20",
                  )}
                  onClick={() => setPageNumber(index + 1)}
                  disabled={loading}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs">{index + 1}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PDF Content */}
        <div ref={containerRef} className="flex-1 overflow-auto bg-muted/10 p-6 flex items-start justify-center">
          {loading && (
            <div className="flex items-center justify-center h-full w-full">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </div>
          )}

          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full w-full">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-full w-full p-4">
                <p className="text-destructive font-medium mb-2">Failed to load PDF</p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  The document could not be loaded. Please try again or check if the file is valid.
                </p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg bg-white"
              canvasBackground="white"
            />
          </Document>
        </div>
      </div>
    </div>
  )
}

