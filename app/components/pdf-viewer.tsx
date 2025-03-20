"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Download, Search, ZoomIn, ZoomOut } from "lucide-react"

export function PDFViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(24) // This would come from the actual PDF
  const [zoomLevel, setZoomLevel] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      setCurrentPage(value)
    }
  }

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10)
    }
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Toolbar */}
      <div className="flex items-center justify-between border-b p-2 bg-muted/30">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={handlePageInputChange}
              className="w-14 h-8 text-center"
            />
            <span className="mx-1 text-sm text-muted-foreground">of {totalPages}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-xs w-12 text-center">{zoomLevel}%</span>

          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
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
            <Button size="sm" variant="secondary">
              Find
            </Button>
          </div>
        </div>
      )}

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4 flex items-start justify-center">
        <div
          className="bg-white shadow-lg rounded-sm transition-all duration-200"
          style={{
            width: `${8.5 * (zoomLevel / 100)}in`,
            height: `${11 * (zoomLevel / 100)}in`,
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* This would be replaced with an actual PDF renderer */}
          <div className="w-full h-full p-8 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Business AI Report</h1>
            <h2 className="text-xl font-semibold mb-2">Page {currentPage}</h2>

            <div className="space-y-4 text-sm">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              </p>

              <h3 className="text-lg font-medium">Key Findings</h3>

              <ul className="list-disc pl-5 space-y-2">
                <li>AI implementation resulted in 45% efficiency improvement</li>
                <li>Cost reduction of 30% across departments</li>
                <li>Customer satisfaction increased by 25%</li>
                <li>Return on investment achieved within 8 months</li>
              </ul>

              <p>
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>

              <div className="border p-3 bg-muted/10 rounded">
                <h4 className="font-medium">Case Study: Company XYZ</h4>
                <p className="mt-1">
                  Implementation of AI chatbots reduced customer service response time by 80% while handling 3x more
                  inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page thumbnails */}
      <div className="border-t h-20 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full p-2 gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              className={`flex-shrink-0 w-12 h-16 border rounded ${
                currentPage === i + 1 ? "border-primary bg-primary/5" : "border-muted"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              <div className="w-full h-full flex items-center justify-center text-xs">{i + 1}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

