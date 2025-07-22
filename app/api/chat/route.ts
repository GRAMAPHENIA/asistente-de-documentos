import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createClient } from "@/lib/supabase"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, documentId } = await req.json()

    // Get document content from database
    const supabase = createClient()
    const { data: document, error } = await supabase
      .from("documents")
      .select("content, name")
      .eq("id", documentId)
      .single()

    if (error || !document) {
      throw new Error("Document not found")
    }

    // Create system prompt with document context
    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided document content. 

Document: ${document.name}
Content: ${document.content}

Instructions:
- Only answer questions based on the document content provided above
- If the question cannot be answered from the document, politely explain that the information is not available in the document
- Be concise and accurate in your responses
- Cite specific parts of the document when relevant`

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
