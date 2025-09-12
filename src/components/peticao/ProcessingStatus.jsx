import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  CheckCircle2, 
  Download, 
  Plus, 
  FileText, 
  Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessingStatus({ result, onNewPetition }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 merriweather mb-4">
            Petição Gerada com Sucesso!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sua petição foi processada pela inteligência artificial
          </p>

          <Card className="border-none shadow-lg text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 merriweather">
                <Sparkles className="w-5 h-5 text-[#6E0000]" />
                Resumo da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {result.resumo || "Petição processada com sucesso. Todos os documentos foram analisados e o resumo jurídico foi gerado conforme os padrões estabelecidos."}
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="bg-[#6E0000] hover:bg-[#8B1538] flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Petição (PDF)
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Visualizar Online
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onNewPetition}
              className="bg-[#6E0000] hover:bg-[#8B1538]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Petição
            </Button>
            <Button asChild variant="outline">
              <Link to={createPageUrl("Historico")}>
                <FileText className="w-4 h-4 mr-2" />
                Ver Histórico
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}