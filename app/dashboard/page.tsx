"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { DocumentCard } from "@/components/document-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase";
import { Plus, Search, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  summary: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchDocuments();
    }
  }, [user, loading, router]);

  const fetchDocuments = async () => {
    if (!supabase) {
      console.warn("Supabase not configured. Using mock documents.");
      const mockDocs: Document[] = [
        {
          id: "1",
          name: "Informe Trimestral Q3.pdf",
          type: "application/pdf",
          size: 2097152,
          summary:
            "Análisis de los resultados financieros y operativos del tercer trimestre del año fiscal.",
          created_at: new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Propuesta de Proyecto Alpha.docx",
          type: "application/vnd",
          size: 512000,
          summary:
            "Documento detallando el alcance, objetivos y presupuesto para el nuevo Proyecto Alpha.",
          created_at: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Notas de la Reunión.txt",
          type: "text/plain",
          size: 15360,
          summary:
            "Resumen de los puntos clave y acciones a seguir discutidas en la reunión del equipo.",
          created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setDocuments(mockDocs);
      setLoadingDocs(false);
      return;
    }

    try {
      setLoadingDocs(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Tus Documentos</h1>
              <p className="text-muted-foreground">
                Administra y chatea con tus documentos cargados
              </p>
            </div>
            <Link href="/upload">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Subir Documento
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Documents Grid */}
          {loadingDocs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {filteredDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DocumentCard
                    document={doc}
                    onDelete={() => fetchDocuments()}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Aún no hay documentos
              </h3>
              <p className="text-muted-foreground mb-6">
                Sube tu primer documento para comenzar a tener conversaciones
                con la IA
              </p>
              <Link href="/upload">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Documento
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
