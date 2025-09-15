import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentPetitions({ peticoes, isLoading }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "concluido": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "processando": return <Clock className="w-4 h-4 text-orange-600 animate-spin" />;
      case "erro": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      rascunho: "bg-gray-100 text-gray-800",
      processando: "bg-orange-100 text-orange-800",
      concluido: "bg-green-100 text-green-800",
      erro: "bg-red-100 text-red-800"
    };
    
    const labels = {
      rascunho: "Rascunho",
      processando: "Processando",
      concluido: "Concluído",
      erro: "Erro"
    };

    return (
      <Badge className={styles[status] || styles.rascunho}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold merriweather">
          Petições Recentes
        </CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link to={createPageUrl("Historico")}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Todas
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <Skeleton className="w-4 h-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : peticoes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 merriweather mb-2">
              Nenhuma petição criada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando sua primeira petição
            </p>
            <Button asChild className="bg-[#6E0000] hover:bg-[#8B1538]">
              <Link to={createPageUrl("CriarPeticao")}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Petição
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {peticoes.slice(0, 5).map((peticao) => (
              <div key={peticao.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {getStatusIcon(peticao.status_geral)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {peticao.tipo_peticao?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {peticao.tipo_categoria?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(peticao.created_date), "d MMM yyyy", { locale: ptBR })}
                  </p>
                </div>
                {getStatusBadge(peticao.status_geral)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}