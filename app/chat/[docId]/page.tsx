"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  name: string;
  type: string;
  summary: string;
  created_at: string;
}

export default function ChatPage() {
  const { docId } = useParams();
  const { user } = useAuth();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchDocument();
  }, [user, docId, router]);

  const fetchDocument = async () => {
    if (!supabase) {
      console.warn(
        `Supabase not configured. Using mock document for ID: ${docId}`
      );
      const mockDoc: Document = {
        id: docId as string,
        name: `Documento de Prueba ${docId}.pdf`,
        type: "application/pdf",
        summary: "Este es un resumen de ejemplo para el documento de prueba.",
        created_at: new Date().toISOString(),
      };
      setDocument(mockDoc);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", docId)
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (error) {
      console.error("Error fetching document:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Document Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold">{document.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {document.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Listo para chatear
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Asistente de IA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <ChatInterface documentId={document.id} />
      </div>
    </div>
  );
}
