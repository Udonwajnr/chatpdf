"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, FileText, Download, Loader2, FileJson, FileCode, FileBadge } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ExportOptionsProps {
  chatId: string
  pdfName: string
}

export function ExportOptions({ chatId, pdfName }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<"markdown" | "html" | "pdf" | "notion" | "google-docs">("markdown")
  const [exportOptions, setExportOptions] = useState({
    includeAnnotations: true,
    includeNotes: true,
    includeHighlights: true,
    includeBookmarks: true,
    includeSummary: true,
  })

  const handleExport = async () => {
    try {
      setIsExporting(true)

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          format: exportFormat,
          options: exportOptions,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to export as ${exportFormat}`)
      }

      // Handle different export formats
      if (exportFormat === "notion" || exportFormat === "google-docs") {
        // For integrations that return a URL
        const data = await response.json()

        // Open the URL in a new tab
        window.open(data.url, "_blank")

        toast("Export successful",{
          description: `Your document has been exported to ${exportFormat === "notion" ? "Notion" : "Google Docs"}`,
        })
      } else {
        // For direct downloads (markdown, HTML, PDF)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${pdfName.replace(/\.[^/.]+$/, "")}-export.${getFileExtension(exportFormat)}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast("Export successful",{
        })
      }
    } catch (error) {
      console.error("Error exporting document:", error)
      toast("Export failed",{
        description: `Failed to export as ${exportFormat}. Please try again.`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getFileExtension = (format: string): string => {
    switch (format) {
      case "markdown":
        return "md"
      case "html":
        return "html"
      case "pdf":
        return "pdf"
      default:
        return "txt"
    }
  }

  const renderFormatIcon = (format: string) => {
    switch (format) {
      case "markdown":
        return <FileText className="h-5 w-5" />
      case "html":
        return <FileCode className="h-5 w-5" />
      case "pdf":
        return <FileBadge className="h-5 w-5" />
      case "notion":
        return <FileJson className="h-5 w-5" />
      case "google-docs":
        return <FileDown className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Document
        </CardTitle>
        <CardDescription>
          Export your document with notes, annotations, and summaries in various formats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Export Format</h3>
          <RadioGroup
            value={exportFormat}
            onValueChange={(value) => setExportFormat(value as any)}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
          >
            <div>
              <RadioGroupItem value="markdown" id="markdown" className="peer sr-only" />
              <Label
                htmlFor="markdown"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <FileText className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Markdown</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="html" id="html" className="peer sr-only" />
              <Label
                htmlFor="html"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <FileCode className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">HTML</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
              <Label
                htmlFor="pdf"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <FileBadge className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">PDF</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="notion" id="notion" className="peer sr-only" />
              <Label
                htmlFor="notion"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm1.775 2.24c.746.56 1.682.466 3.13.326l11.536-.84a.43.43 0 0 0 .374-.466l-.7-1.167c-.14-.28-.374-.466-.7-.42l-11.97.793c-.98.047-1.4-.233-1.96-.746-.093.327 0 1.307 0 1.307l.28 1.213zm1.868 1.87l.84 6.26c.187 1.307.887 1.121 2.055.98l10.276-1.026c.7-.14.934-.466.7-1.026l-.84-6.35c-.14-.56-.56-.84-1.214-.7l-11.156 1.12c-.7.047-.934.326-.654.746zm7.878 6.54l-4.9.513c-.28.047-.374.233-.327.42l.187.886c.093.28.28.374.654.28l4.2-.513c.28-.047.374-.187.28-.42l-.186-.886c-.47-.233-.327-.326-.607-.28zm-5.6-3.736l5.226-.513c.467-.047.56-.42.374-.7l-.374-.84c-.14-.28-.56-.374-.887-.327l-4.76.467c-.32.047-.413.327-.32.607l.234.7c.94.233.34.42.7.327zm6.54 1.4l-5.18.606c-.42.047-.56.327-.42.56l.326.747c.14.28.513.374.84.327l4.62-.56c.373-.047.513-.327.373-.607l-.326-.746c-.14-.234-.374-.374-.654-.327z" />
                </svg>
                <span className="text-sm font-medium">Notion</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="google-docs" id="google-docs" className="peer sr-only" />
              <Label
                htmlFor="google-docs"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg className="mb-3 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zm-.545 10.455H7.09v-1.364h7.09v1.364zm2.727-3.273H7.091v-1.364h9.818v1.364zm0-3.273H7.091V9.273h9.818v1.363zM14.727 6h6l-6-6v6z" />
                </svg>
                <span className="text-sm font-medium">Google Docs</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Export Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAnnotations"
                checked={exportOptions.includeAnnotations}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeAnnotations: !!checked })}
              />
              <Label htmlFor="includeAnnotations">Include All Annotations</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNotes"
                checked={exportOptions.includeNotes}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeNotes: !!checked })}
              />
              <Label htmlFor="includeNotes">Include Notes</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeHighlights"
                checked={exportOptions.includeHighlights}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeHighlights: !!checked })}
              />
              <Label htmlFor="includeHighlights">Include Highlights</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeBookmarks"
                checked={exportOptions.includeBookmarks}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeBookmarks: !!checked })}
              />
              <Label htmlFor="includeBookmarks">Include Bookmarks</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeSummary"
                checked={exportOptions.includeSummary}
                onCheckedChange={(checked) => setExportOptions({ ...exportOptions, includeSummary: !!checked })}
              />
              <Label htmlFor="includeSummary">Include Summary</Label>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleExport} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as{" "}
              {exportFormat === "google-docs"
                ? "Google Docs"
                : exportFormat === "notion"
                  ? "Notion"
                  : exportFormat.toUpperCase()}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

