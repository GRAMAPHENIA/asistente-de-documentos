"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!user) return;

      setUploading(true);
      setUploadProgress(0);

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadProgress(((i + 1) / files.length) * 100);

          // Process file here
          await processFile(file);
        }

        toast({
          title: "¡Carga exitosa!",
          description: `${files.length} documento(s) cargado(s) y procesado(s).`,
        });

        router.push("/dashboard");
      } catch (error: any) {
        toast({
          title: "Error en la carga",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [user, toast, router]
  );

  const processFile = async (file: File) => {
    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would:
    // 1. Extract text from the file
    // 2. Generate embeddings
    // 3. Store in database
    // 4. Generate summary
  };

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
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Subir Documentos</h1>
              <p className="text-muted-foreground">
                Sube tus documentos para empezar a chatear con la IA
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Archivos</CardTitle>
                <CardDescription>
                  Formatos soportados: PDF, DOCX, TXT, MD (Máx 10MB por archivo)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Procesando documentos...
                    </p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.round(uploadProgress)}% completado
                    </p>
                  </div>
                ) : (
                  <FileUpload onUpload={handleFileUpload} />
                )}
              </CardContent>
            </Card>

            {/* Supported formats */}
            <div className="mt-8 p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Tipos de Archivo Soportados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>DOCX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>TXT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>MD</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
