import { createClient } from "@/lib/supabase"
import { openai } from "@ai-sdk/openai"
import { generateText, embed } from "ai"

export class DocumentProcessor {
  private supabase = createClient()

  async processDocument(file: File, userId: string) {
    try {
      // Extract text from file
      const text = await this.extractText(file)

      // Generate summary
      const summary = await this.generateSummary(text)

      // Generate embeddings
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: text,
      })

      // Store in database
      const { data, error } = await this.supabase
        .from("documents")
        .insert({
          user_id: userId,
          name: file.name,
          type: this.getFileExtension(file.name),
          size: file.size,
          content: text,
          summary,
          embedding,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error processing document:", error)
      throw error
    }
  }

  private async extractText(file: File): Promise<string> {
    const fileType = file.type

    if (fileType === "text/plain" || fileType === "text/markdown") {
      return await file.text()
    }

    if (fileType === "application/pdf") {
      // For PDF extraction, you would use a library like pdf-parse
      // For now, we'll simulate text extraction
      return `Extracted text from PDF: ${file.name}\n\nThis is simulated content that would normally be extracted from the PDF file using a proper PDF parsing library.`
    }

    if (fileType.includes("word") || fileType.includes("document")) {
      // For DOCX extraction, you would use a library like mammoth
      // For now, we'll simulate text extraction
      return `Extracted text from Word document: ${file.name}\n\nThis is simulated content that would normally be extracted from the Word document using a proper document parsing library.`
    }

    throw new Error(`Unsupported file type: ${fileType}`)
  }

  private async generateSummary(text: string): Promise<string> {
    try {
      const { text: summary } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Please provide a concise summary (2-3 sentences) of the following document content:\n\n${text.substring(0, 4000)}`,
      })

      return summary
    } catch (error) {
      console.error("Error generating summary:", error)
      return "Summary generation failed"
    }
  }

  private getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "unknown"
  }

  async searchSimilarContent(query: string, documentId: string, limit = 5) {
    try {
      // Generate embedding for the query
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: query,
      })

      // Search for similar content using vector similarity
      const { data, error } = await this.supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit,
        document_id: documentId,
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error searching similar content:", error)
      return []
    }
  }
}
