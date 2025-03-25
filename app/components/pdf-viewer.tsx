"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
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
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {toast} from "sonner"

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

interface PDFViewerProps {
  pdfUrl: string
}

interface SearchResult {
  pageNumber: number
  text: string
  position: {
    top: number
    left: number
    width: number
    height: number
  }
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(-1)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [aiSearchResults, setAiSearchResults] = useState<string>("")
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [matches, setMatches] = useState<{ page: number; positions: number[] }[]>([]);
  

  useEffect(() => {
    // Reset to page 1 when a new PDF is loaded
    setPageNumber(1)
    setLoading(true)
    setRotation(0)
    setSearchResults([])
    setCurrentSearchIndex(-1)
    setSearchQuery("")
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
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])
    setCurrentSearchIndex(-1)

    try {
      // In a real implementation, you would use PDF.js to search through the document
      // This is a simplified example that simulates search results

      // Simulate a delay for the search operation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock search results for demonstration
      const mockResults: SearchResult[] = []

      // Generate some mock results across different pages
      for (let i = 1; i <= Math.min(numPages || 5, 5); i++) {
        if (Math.random() > 0.3) {
          // 70% chance to have results on a page
          const resultsPerPage = Math.floor(Math.random() * 3) + 1

          for (let j = 0; j < resultsPerPage; j++) {
            mockResults.push({
              pageNumber: i,
              text: `...text containing "${searchQuery}" and surrounding context...`,
              position: {
                top: Math.random() * 700 + 100,
                left: Math.random() * 400 + 50,
                width: 200,
                height: 20,
              },
            })
          }
        }
      }

      setSearchResults(mockResults)

      if (mockResults.length > 0) {
        setCurrentSearchIndex(0)
        setPageNumber(mockResults[0].pageNumber)
        toast("Search Results",{

          description: `Found ${mockResults.length} matches for "${searchQuery}"`,
        })
      } else {
        toast("No Results",{
          description: `No matches found for "${searchQuery}"`,

        })
      }
    } catch (error) {
      console.error("Error searching PDF:", error)
      toast("Search Error",{
        description: "An error occurred while searching the document",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const navigateToNextSearchResult = () => {
    if (searchResults.length === 0) return

    const nextIndex = (currentSearchIndex + 1) % searchResults.length
    setCurrentSearchIndex(nextIndex)
    setPageNumber(searchResults[nextIndex].pageNumber)
  }

  const navigateToPreviousSearchResult = () => {
    if (searchResults.length === 0) return

    const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length
    setCurrentSearchIndex(prevIndex)
    setPageNumber(searchResults[prevIndex].pageNumber)
  }

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return

    setIsAiSearching(true)
    setAiSearchResults("")

    try {
      const response = await fetch("/api/pdf/ai-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl,
          query: searchQuery,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to perform AI search")
      }

      const data = await response.json()
      setAiSearchResults(data.result)
    } catch (error) {
      console.error("Error performing AI search:", error)
      toast("AI Search Error",{
        description: "An error occurred while performing AI search",
      })
    } finally {
      setIsAiSearching(false)
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "f") {
          e.preventDefault()
          toggleSearch()
        } else if (e.key === "g") {
          e.preventDefault()
          navigateToNextSearchResult()
        } else if (e.key === "G" || (e.shiftKey && e.key === "g")) {
          e.preventDefault()
          navigateToPreviousSearchResult()
        }
      }
    },
    [searchResults, currentSearchIndex],
  )

  const searchPdf = async (pdfUrl: string, searchTerm: string) => {
    const pdf = await pdfjs.getDocument(pdfUrl).promise;
    let results: { page: number; positions: number[] }[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item) => (item as any).str);
      const text = textItems.join(" ");

      let positions: number[] = [];
      let index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
      while (index !== -1) {
        positions.push(index);
        index = text.toLowerCase().indexOf(searchTerm.toLowerCase(), index + 1);
      }

      if (positions.length > 0) {
        results.push({ page: i, positions });
      }
    }

    setMatches(results);
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

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
              <TooltipContent>Search (Ctrl+F)</TooltipContent>
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
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={searchInputRef}
                  placeholder="Search in document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  className="text-sm pr-16"
                />
                {searchResults.length > 0 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
              >
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4 mr-1" />
                )}
                Find
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" disabled={!searchQuery.trim() || isAiSearching}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Search
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">AI-Powered Search</h4>
                    <p className="text-xs text-muted-foreground">
                      Get AI-generated insights about "{searchQuery}" from this document.
                    </p>
                    <Button size="sm" className="w-full" onClick={handleAiSearch} disabled={isAiSearching}>
                      {isAiSearching ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Get AI Insights
                        </>
                      )}
                    </Button>
                    {aiSearchResults && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md text-xs">
                        <p className="whitespace-pre-line">{aiSearchResults}</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <Button size="sm" variant="ghost" onClick={toggleSearch} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={navigateToPreviousSearchResult} className="h-8">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Previous
                  </Button>
                  <Button size="sm" variant="outline" onClick={navigateToNextSearchResult} className="h-8">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    Next
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">{searchResults.length} results found</div>
              </div>
            )}
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
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg bg-white"
                canvasBackground="white"
              />

              {/* Search result highlights */}
              {searchResults.length > 0 && searchResults.some((result) => result.pageNumber === pageNumber) && (
                <div className="absolute inset-0 pointer-events-none">
                  {searchResults
                    .filter((result) => result.pageNumber === pageNumber)
                    .map((result, index) => (
                      <div
                        key={index}
                        className={cn(
                          "absolute border-2 rounded",
                          index === currentSearchIndex && searchResults[currentSearchIndex].pageNumber === pageNumber
                            ? "border-primary bg-primary/20"
                            : "border-yellow-400 bg-yellow-100/40",
                        )}
                        style={{
                          top: `${result.position.top}px`,
                          left: `${result.position.left}px`,
                          width: `${result.position.width}px`,
                          height: `${result.position.height}px`,
                          transform: `scale(${scale}) rotate(${rotation}deg)`,
                          transformOrigin: "top left",
                        }}
                      />
                    ))}
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>
    </div>
  )
}

