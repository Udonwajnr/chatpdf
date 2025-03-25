"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, Download, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface NotesExtractorProps {
  chatId: string
  pdfUrl: string
}

export function NotesExtractor({ chatId, pdfUrl }: NotesExtractorProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [notes, setNotes] = useState<string>("")
  const [bulletPoints, setBulletPoints] = useState<string[]>([])
  const [summary, setSummary] = useState<string>("")
  const [pageRange, setPageRange] = useState("")
  const [copied, setCopied] = useState(false)
  const [extractOptions, setExtractOptions] = useState({
    keyPoints: true,
    definitions: true,
    examples: true,
    summaries: true,
  })
//   const { toast } = useToast()

  const extractNotes = async () => {
    try {
      setIsExtracting(true)

      const response = await fetch("/api/notes/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          pageRange: pageRange || "all",
          options: extractOptions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to extract notes")
      }

      const data = await response.json()
      setNotes(data.notes)
      setBulletPoints(data.bulletPoints)
      setSummary(data.summary)

      toast("Notes extracted",{
        description: "Successfully extracted notes from your document",
      })
    } catch (error) {
      console.error("Error extracting notes:", error)
      toast("Extraction failed",{
        description: "Failed to extract notes. Please try again.",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast("Copied to clipboard",{
      description: "Notes copied to clipboard successfully",
    })
  }

  const downloadAsMarkdown = () => {
    const element = document.createElement("a")
    const file = new Blob([notes], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `notes-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadAsHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Study Notes</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1, h2, h3 { color: #333; }
          ul { padding-left: 20px; }
          .summary { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>Study Notes</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p>${summary}</p>
        </div>
        <h2>Key Points</h2>
        <ul>
          ${bulletPoints.map((point) => `<li>${point}</li>`).join("")}
        </ul>
        <h2>Detailed Notes</h2>
        ${notes.replace(/\n/g, "<br>")}
      </body>
      </html>
    `

    const element = document.createElement("a")
    const file = new Blob([htmlContent], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `notes-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full sm:w-32 space-y-2">
          <label htmlFor="pageRange" className="text-sm font-medium">
            Page Range
          </label>
          <Input
            id="pageRange"
            placeholder="e.g., 1-5"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Extract Options</label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keyPoints"
                checked={extractOptions.keyPoints}
                onCheckedChange={(checked) => setExtractOptions({ ...extractOptions, keyPoints: !!checked })}
              />
              <Label htmlFor="keyPoints">Key Points</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="definitions"
                checked={extractOptions.definitions}
                onCheckedChange={(checked) => setExtractOptions({ ...extractOptions, definitions: !!checked })}
              />
              <Label htmlFor="definitions">Definitions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="examples"
                checked={extractOptions.examples}
                onCheckedChange={(checked) => setExtractOptions({ ...extractOptions, examples: !!checked })}
              />
              <Label htmlFor="examples">Examples</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="summaries"
                checked={extractOptions.summaries}
                onCheckedChange={(checked) => setExtractOptions({ ...extractOptions, summaries: !!checked })}
              />
              <Label htmlFor="summaries">Section Summaries</Label>
            </div>
          </div>
        </div>

        <Button onClick={extractNotes} disabled={isExtracting} className="mt-2 sm:mt-0">
          {isExtracting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" /> Extract Notes
            </>
          )}
        </Button>
      </div>

      {(notes || bulletPoints.length > 0 || summary) && (
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notes">Full Notes</TabsTrigger>
            <TabsTrigger value="bullets">Bullet Points</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(notes)}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
                <Download className="h-4 w-4 mr-2" /> Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsHTML}>
                <Download className="h-4 w-4 mr-2" /> HTML
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <Textarea value={notes} readOnly className="min-h-[300px] font-mono text-sm" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bullets" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(bulletPoints.join("\n• "))}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-2 pl-5 list-disc">
                  {bulletPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(summary)}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy
              </Button>
            </div>
            <Card>
              <CardContent className="p-4">
                <p className="whitespace-pre-line">{summary}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

