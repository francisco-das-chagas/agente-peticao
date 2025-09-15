import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import DocumentUploadCard from "./DocumentUploadCard";

const REQUIRED_DOCS = [
  {
    key: "relatorio_processo",
    title: "Relatório do Processo",
    description: "Upload ou digite o relatório completo do processo",
    acceptedTypes: ".pdf,.doc,.docx,.txt",
    maxSize: "100MB",
    hasTextAlternative: true
  },
  {
    key: "documentos_essenciais", 
    title: "Documentos Essenciais",
    description: "Faça upload dos documentos ou liste-os",
    acceptedTypes: ".pdf,.doc,.docx,.jpg,.png,.txt",
    maxSize: "100MB",
    hasTextAlternative: true
  },
  {
    key: "copia_processo",
    title: "Cópia Completa do Processo", 
    description: "Upload do processo completo ou cole o conteúdo",
    acceptedTypes: ".pdf,.doc,.docx",
    maxSize: "200MB",
    hasTextAlternative: true
  }
];

export default function RequiredDocuments({ documents, onDocumentUpdate }) {
  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 font-semibold">
          <strong>OBRIGATÓRIO:</strong> Todos os 3 documentos são necessários para gerar a petição.
        </AlertDescription>
      </Alert>

      {REQUIRED_DOCS.map((doc) => (
        <DocumentUploadCard
          key={doc.key}
          document={doc}
          status={documents[doc.key]?.status || "pendente"}
          onUpdate={(data) => onDocumentUpdate(doc.key, data)}
        />
      ))}
    </div>
  );
}