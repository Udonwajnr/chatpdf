"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Search, X, ZoomIn, ZoomOut } from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset to page 1 when a new PDF is loaded
    setPageNumber(1)
    setLoading(true)
  }, [pdfUrl])

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

  return (
    <div className="flex flex-col h-full">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between border-b p-2 bg-muted/30">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={pageNumber <= 1 || loading}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center">
            <Input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageNumber}
              onChange={handlePageInputChange}
              className="w-14 h-8 text-center"
              disabled={loading}
            />
            <span className="mx-1 text-sm text-muted-foreground">of {numPages || "?"}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={!numPages || pageNumber >= numPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleSearch} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5 || loading}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>

          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={scale >= 2.0 || loading}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleDownload} disabled={loading}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="p-2 border-b">
          <div className="flex gap-2">
            <Input
              placeholder="Search in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
            <Button size="sm" variant="secondary" disabled={!searchQuery.trim()}>
              Find
            </Button>
            <Button size="sm" variant="ghost" onClick={toggleSearch}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/20 p-4 flex items-start justify-center">
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
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      {/* Page thumbnails */}
      {numPages && numPages > 1 && (
        <div className="border-t h-20 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full p-2 gap-2">
            {Array.from(new Array(numPages), (_, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-12 h-16 border rounded ${
                  pageNumber === index + 1 ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onClick={() => setPageNumber(index + 1)}
                disabled={loading}
              >
                <div className="w-full h-full flex items-center justify-center text-xs">{index + 1}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

